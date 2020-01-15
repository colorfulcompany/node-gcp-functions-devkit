const yargs = require('yargs')

const Config = require('./config')
const Launcher = require('./launcher')
const Publisher = require('./publisher')
const Subscriber = require('./subscriber')

class Command {
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
      .command({
        command: 'sub',
        builder: () => {},
        handler: this.sub.bind(this)
      })
      .command({
        command: 'pub',
        builder: (yargs) => {
          return yargs
            .option('topic', {
              alias: 't',
              type: 'string',
              required: true
            })
            .option('message', {
              alias: 'm',
              type: 'string',
              required: true
            })
        },
        handler: this.pub.bind(this)
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
    const config = new Config(configPath)
    config.init()

    return config
  }

  /**
   * @param {object} argv - parsed yargs
   * @return {object} - Launcher
   */
  launch (argv) {
    const launcher = new Launcher(this.createConfig(argv.c))
    ;(async () => launcher.run())()

    this.lastExecuted = launcher
  }

  /**
   * @param {object} argv - parsed yargs
   * @return {object} - Subscriber
   */
  sub (argv) {
    const subscriber = new Subscriber(this.createConfig(argv.c))
    ;(async () => subscriber.run())()

    this.lastExecuted = subscriber
  }

  /**
   * @param {object} argv - parsed yargs
   * @return {object} - Publisher
   */
  pub (argv) {
    const publisher = new Publisher(this.createConfig(argv.c))
    publisher.run(argv)

    this.lastExecuted = publisher
  }
}

module.exports = Command
