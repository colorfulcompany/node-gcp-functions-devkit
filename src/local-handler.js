module.exports = async function localHandler (req, res, callback) {
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
