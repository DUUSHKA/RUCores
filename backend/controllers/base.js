/*global process*/
import express from 'express'
// eslint-disable-next-line no-undef
require("dotenv").config()

const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})