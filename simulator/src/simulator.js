require('dotenv').config()
const axios = require('axios')
const BACKEND = process.env.BACKEND_URL || 'http://localhost:4000/telemetry'
const DEVICE_ID = process.env.DEVICE_ID || 'device-01'

async function sendTelemetry() {
  const payload = {
    deviceId: DEVICE_ID,
    timestamp: new Date().toISOString(),
    temperature: 40 + Math.random() * 10,
    vibration: Math.random() * 5,
    status: 'OK'
  }
  try {
    await axios.post(BACKEND, payload)
    console.log('sent', payload)
  } catch (e) {
    console.error('send failed', e.message)
  }
}

setInterval(sendTelemetry, 2000)
sendTelemetry()