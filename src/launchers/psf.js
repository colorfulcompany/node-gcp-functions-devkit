const execa = require('execa')
const kill = require('tree-kill')

class PsfLauncher {
  /**
   * @param {object} config
   */
  constructor (config) {
    this.config = config
    this.procs = []
  }

  async run () {
    process.env.PUBSUB_EMULATOR_HOST = this.config['emulator-host-port']
    await this.launchFunctions()
    await this.launchEmulator()
  }

  async launchEmulator () {
    const proc = execa('gcloud', ['beta', 'emulators', 'pubsub', 'start', '--host-port', this.config['emulator-host-port'], '--project', this.config.projectId])
    if (process.env.NODE_ENV !== 'test') {
      proc.stdout.pipe(process.stdout)
      proc.stderr.pipe(process.stderr)
    }
    console.debug(`listening emulator on ${this.config['emulator-host-port']}`)
    this.procs.push(proc)
  }

  /**
   * launch functions-framework for each subscribers
   *
   * given config format
   *
   * topics:
   *   - name:
   *     subscriptions:
   *       - name:
   *         pushEndpoint:  <- use
   *         handler:  <- use
   *       - ...
   *   - ...
   */
  async launchFunctions () {
    this.config.topics.forEach((topic) => {
      topic.subscriptions.forEach(async (subscription) => {
        const spec = this.extractFuncSpec(subscription)
        const proc = execa('nodemon', ['-x', 'functions-framework', '--target', spec.handler, '--port', spec.port])
        if (process.env.NODE_ENV !== 'test') {
          proc.stdout.pipe(process.stdout)
          proc.stderr.pipe(process.stderr)
        }
        this.procs.push(proc)
        console.debug(`listening function ${spec.handler} on ${spec.port}`)
      })
    })
  }

  /**
   * @param {object} subscription
   * @return {object}
   */
  extractFuncSpec (subscription) {
    return {
      port: subscription.pushEndpoint.split(':')[2],
      handler: subscription.handler
    }
  }

  async kill () {
    return Promise.all(this.procs.map((proc) => {
      kill(proc.pid, 'SIGKILL', (err) => {
        if (err !== undefined) {
          console.error(err)
        }
        return true
      })
    }))
  }
}

module.exports = PsfLauncher
