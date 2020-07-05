## Cloud Functions development kit

### Features

 * invoke functions with `functions-framework` and automatically reload with `nodemon`
    * support http function and pubsub function
 * inovoke pubsub emulator
 * make http push subscription
 * `localHandler` helps pubsub function works with local `functions-framework`
 * publish message to pubsub emulator

### How To Use

 * npm install gcp-functions-devkit

#### for http functions

* place **`.htf-devkit.yml`** for function target and port
 * `htf-devkit launch` command starts `functions-framework` with `nodemon`

#### for pubsub functions

 * place **`.psf-devkit.yml`** for setting emulator host-port and topics ( pushEndpoint subscription and handler )
 * `psf-devkit launch` command starts `pubsub emulator` and `functions-framework` with `nodemon`
 * `psf-devkit sub` subscribe push subscriptions to `pubsub emulator`
 * `psf-devkit pub` publish message to `pubsub emulator` ( and functions-framework will receive this message )

### Examples

#### psf-devkit

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
exports.localSub = async (req, res) => localHandler(req, res, sub)
```

### htf-devkit

.htf-devkit.yml

```yaml
- target: func1
  port: 9000
- target: func2
  port: 9010
```

index.js

```javascript
exports.func1 = async (req, res) => {
}

exports.func2 = async (req, res) => {
}
```
