const { PubSub } = require('@google-cloud/pubsub')

class Subscriber {
  /**
   * @param {object} config
   */
  constructor (config) {
    this.config = config
  }

  /**
   * subscribe push subscription
   *
   * given config format
   *
   * topics:
   *   - name:

   *     subscriptions:
   *       - name:  <- use
   *         pushEndpoint:  <- use
   *         handler:
   *       - ...
   *   - ...
   */
  async run () {
    process.env.PUBSUB_EMULATOR_HOST = this.config['emulator-host-port']

    const pubsub = new PubSub({ projectId: this.config.projectId })

    Promise.all(this.config.topics.map(async (topic) => {
      await pubsub.createTopic(topic.name)
      console.debug(`created topic ${topic.name}`)
      Promise.all(topic.subscriptions.map(async (subscription) => {
        await pubsub.createSubscription(
          topic.name,
          subscription.name,
          { pushEndpoint: subscription.pushEndpoint }
        )
        console.debug(`created subscription ${subscription.name} to ${subscription.pushEndpoint}`)
      }))
    }))
  }
}

module.exports = Subscriber
