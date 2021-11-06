import express from 'express'

const app = express()

const hostname = 'localhost'
const port = 8080

app.get('/', (req, res) => {
  res.end('<h1>API Bank Management</h1><hr>')
})

app.listen(port, hostname, () => {
  // eslint-disable-next-line no-console
  console.log(`API Bank Management on ${hostname}:${port}`)
})