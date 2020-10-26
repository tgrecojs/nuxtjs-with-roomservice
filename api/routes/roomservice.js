const express = require('express')
const fetch = require('node-fetch')
const app = express()
app.use(express.json())

// replace this with your API key from https://app.roomservice.dev/
const API_KEY = 'HjCuI4jxFy9B9TJ0UBvau'

// Replace this with your authorization scheme.
function isLoggedIn(req) {
  return true // for the moment, we'll just let everyone in
}

const createUser = () => Math.random().toString(36).substr(2, 9)

app.post('/my-roomservice', async (req, res) => {
  if (!isLoggedIn(req)) {
    return res.send(401)
  }
  // In practice, this should be whatever user id YOU use.
  const user = createUser()
  const body = req.body
  const r = await fetch('https://super.roomservice.dev/provision', {
    method: 'post',
    headers: {
      Authorization: `Bearer: ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user,
      resources: body.resources,
    }),
  })
  const json = await r.json()
  return res.json(json)
})

module.exports = app
