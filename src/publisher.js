const execa = require('execa')
const { Readable } = require('stream')

class Publisher {
  /**
   * @param {string} project
   */
  constructor (config) {
    this.config = config
  }

  /**
   * @param {object} argv
   */
  async run (argv) {
    process.env.PUBSUB_EMULATOR_HOST = this.config['emulator-host-port']
    return new Promise((resolve, reject) => {
      const readable = new Readable()
      const { stdin } = execa('publish-to-pubsub-topic', [argv.topic, '--project', this.config.projectId])
      stdin.on('error', (err) => reject(err))
      readable.on('error', (err) => reject(err))
      readable.on('end', () => resolve(argv.message))
      readable.on('close', () => resolve(argv.message))

      readable.pipe(stdin)

      readable.push(argv.message)
      readable.push(null)
    })
  }
}

module.exports = Publisher
