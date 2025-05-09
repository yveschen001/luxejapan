// TeleSoul 集成測試專用 mock server
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())

app.get('/health', (req, res) => {
  res.status(200).send('ok')
})

app.get('/api/version', (req, res) => {
  res.status(200).json({ version: '1.0.0' })
})

app.get('/api/user/profile', (req, res) => {
  res.status(200).json({ id: 1, username: 'testuser' })
})

app.get('/', (req, res) => {
  res.status(200).send(`<!DOCTYPE html><html><head><title>TeleSoul</title></head><body><h1>TeleSoul</h1></body></html>`)
})

app.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}`)
}) 