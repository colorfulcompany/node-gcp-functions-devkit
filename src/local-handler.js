module.exports = async function localHandler (req, res, callback) {
  const message = Buffer.from(req.body.message.data, 'base64').toString()
  const timestamp = (new Date()).toLocaleString('default', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZoneName: 'short' })

  console.debug(`[${timestamp}] invoke [Function: ${callback.name}] with ${message}`)
  const r = (await callback(req.body.message, {}))
    ? {
      status: 200,
      message: '200 OK'
    }
    : {
      status: 400,
      message: '400 Bad Request'
    }

  res.status(r.status).send(r.message)
}
