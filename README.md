## PubSub Functions local development kit

### Features

 * inovoke pubsub mulator
 * make http push subscription
 * `localHandler` helps pubsub function works with local `functions-framework`
 * publish message to pubsub emulator

### How To Use

 * npm install gcp-psf-local-devkit
 * place .psf-devkit.yml for setting emulator host-port and topics ( pushEndpoint subscription and handler )
 * `psf-devkit launch` command starts `pubsub emulator` and `functions-framework`
 * `psf-devkit sub` subscribe push subscriptions to `pubsub emulator`
 * `psf-devkit pub` publish message to `pubsub emulator` ( and functions-framework will receive this message )

### Examples

.psf-devkit.yml

```yaml
emulator-host-port: localhost:8085
projectId: test-projects
topics:
  - name: topic1
    subscriptions:
      - name: sub1
        pushEndpoint: http://localhost:9080 # no trailing slash
        handler: localSub1
      - name: sub2
        pushEndpoint: http://localhost:9081
        handler: localSub2
  - name: topic2
    subscriptions:
      - name: sub3
        pushEndpoint: http://localhost:9082
        handler: localSub3
```

index.js

```javascript
const { localHandler } = require('gcp-psf-local-devkit')
const fs = require('fs')

// for production
async function sub (event, context) {
  const message = Buffer.from(event.data, 'base64').toString()
  fs.writeFileSync('functions.log', message)

  return true
}

// for production
exports.sub = sub
// for local development (cannot receive valid context object)
exports.localSub = async (req, res) => localHandler(req, {}, sub)
```
