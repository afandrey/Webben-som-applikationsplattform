/**
 * Starting point of application
*/

'use strict'

let express = require('express')
let bodyParser = require('body-parser')
let https = require('https')
let fs = require('fs')
require('dotenv').config()

let app = express()
let port = process.env.PORT || 3000

let mongoose = require('./config/mongoose.js')
mongoose()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.json({
    'links': {
      api: { href: '/api', method: 'GET', title: 'Starting point of API.' }
    }
  })
})

// Routes
app.use('/api', require('./routes/home.js'))
app.use('/api/catches', require('./routes/catches.js'))
app.use('/api/users', require('./routes/users.js'))
app.use('/api/webhooks', require('./routes/webhooks.js'))

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
})

// Launch
https.createServer({
  key: fs.readFileSync('./config/sslcerts/key.pem'),
  cert: fs.readFileSync('./config/sslcerts/cert.pem')
}, app).listen(port, function () {
  console.log('Express app listening on port ' + port)
})
