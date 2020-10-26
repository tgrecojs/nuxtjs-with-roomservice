const express = require('express')
const app = express()
const roomservice = require('./routes/roomservice')

app.use(roomservice)

module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}
