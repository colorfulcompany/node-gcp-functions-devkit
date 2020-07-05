const execa = require('execa')
const kill = require('tree-kill')

class HtfLauncher {
  /**
   * @param {object} config
   */
  constructor (config) {
    this.config = config
    this.procs = []
  }

  async run () {
    await this.launchFunctions()
  }

  /**
   * launch functions-framework for each entries
   *
   * given config format
   *
   * - target:
   *   port:
   * - target:
   *   port:
   * ...
   */
  async launchFunctions () {
    this.config.funcs.forEach((func) => {
      const proc = execa('nodemon', ['-x', 'functions-framework', '--target', func.target, '--port', func.port])
      if (process.env.NODE_ENV !== 'test') {
        proc.stdout.pipe(process.stdout)
        proc.stderr.pipe(process.stderr)
      }
      this.procs.push(proc)
      console.debug(`listening function ${func.target} on ${func.port}`)
    })
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

module.exports = HtfLauncher
