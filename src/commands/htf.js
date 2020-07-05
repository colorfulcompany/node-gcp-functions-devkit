const yargs = require('yargs')

const HtfConfig = require('../configs/htf')
const HtfLauncher = require('../launchers/htf')

class PsfCommand {
  /**
   * @param {Array} argv
   */
  constructor (argv) {
    this.argv = argv
    this.lastExecuted = undefined
  }

  /**
   * @return {object}
   */
  async run () {
    this.options.parse(this.argv)

    return this.lastExecuted
  }

  /**
   * @return {object}
   */
  get options () {
    return yargs
      .command({
        command: 'launch',
        builder: () => {},
        handler: this.launch.bind(this)
      })
      .option('config', {
        alias: 'c'
      })
  }

  /**
   * @param {string} configPath
   * @return {object}
   */
  createConfig (configPath) {
    const config = new HtfConfig(configPath)
    config.init()

    return config
  }

  /**
   * @param {object} argv - parsed yargs
   * @return {object} - Launcher
   */
  launch (argv) {
    const launcher = new HtfLauncher(this.createConfig(argv.c))
    ;(async () => launcher.run())()

    this.lastExecuted = launcher
  }
}

module.exports = PsfCommand
