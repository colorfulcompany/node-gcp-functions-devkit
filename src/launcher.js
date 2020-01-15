const execa = require('execa')
const kill = require('tree-kill')

class Launcher {
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
        const proc = execa('functions-framework', ['--target', spec.handler, '--port', spec.port])
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
    return new Promise((resolve, reject) => {
      Promise.all(this.procs.map(async (proc) => {
        kill(proc.pid, (err) => reject(err))
      }))
      resolve(true)
    })
  }
}

module.exports = Launcher
