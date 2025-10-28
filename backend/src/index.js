require('dotenv').config()
const express = require('express')
const cors = require('cors')
const http = require('http')
const WebSocket = require('ws')
const bodyParser = require('express').json
const { Pool } = require('pg')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
async function initDb() {
  const client = await pool.connect()
  await client.query(`CREATE TABLE IF NOT EXISTS telemetry (id SERIAL PRIMARY KEY, device_id TEXT, ts TIMESTAMP DEFAULT NOW(), temperature REAL, vibration REAL, status TEXT);`)
  client.release()
}

const app = express()
app.use(cors())
app.use(bodyParser())

const server = http.createServer(app)
const wss = new WebSocket.Server({ server, path: '/ws' })
app.locals.wss = wss

app.post('/telemetry', async (req, res) => {
  const { deviceId, timestamp, temperature, vibration, status } = req.body
  await pool.query(
    'INSERT INTO telemetry (device_id, ts, temperature, vibration, status) VALUES ($1, COALESCE($2, NOW()), $3, $4, $5)',
    [deviceId, timestamp, temperature, vibration, status]
  )
  const msg = JSON.stringify({ type: 'telemetry', payload: req.body })
  wss.clients.forEach(c => { if (c.readyState === 1) c.send(msg) })
  res.status(202).send({ accepted: true })
})

app.get('/devices', async (req, res) => {
  const r = await pool.query('SELECT DISTINCT device_id FROM telemetry LIMIT 100')
  res.send(r.rows.map(r => ({ id: r.device_id })))
})

async function start() {
  await initDb()
  const port = process.env.PORT || 4000
  server.listen(port, () => console.log('Backend listening on', port))
}
start()