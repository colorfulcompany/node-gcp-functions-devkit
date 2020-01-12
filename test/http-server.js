const express = require('express')

const app = express()
app.use(express.json())
app.post('/', (req, res) => {
  console.log(req.body)
  res.status(200).send('200 OK')
})

console.log('listening localhost:9082')
app.listen(9082)
