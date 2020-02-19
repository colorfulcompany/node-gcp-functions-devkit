/**
 * @return {string}
 */
function timestamp () {
  return (new Date()).toLocaleString(
    'default',
    {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'short'
    })
}

/**
 * @param {object} req
 * @return {string}
 */
function message (req) {
  const message = req.body.message.data || req.body.message

  return Buffer.from(message, 'base64').toString()
}

module.exports = async function localHandler (req, res, callback) {
  console.debug(`[${timestamp()}] invoke [Function: ${callback.name}] with ${message(req)}`)
  try {
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
  } catch (e) {
    console.error('[psf-devkit] !!! FATAL ERROR, BUT RETRY HAS CANCELLED BY LOCAL HANDLER !!!')
    console.error(e)
    res.status(200).send('')
  }
}
