/**
 * Starting point of application
*/

'use strict'

let express = require('express')
let app = express()
let exphbs = require('express-handlebars')
let bodyParser = require('body-parser')
let path = require('path')
let https = require('https')
let fs = require('fs')
let port = 8080

// View engine
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}))
app.set('view engine', '.hbs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/home.js'))

// Launch application
let server = https.createServer({
  key: fs.readFileSync('./config/sslcerts/key.pem'),
  cert: fs.readFileSync('./config/sslcerts/cert.pem')
}, app).listen(port, function () {
  console.log('Express app listening on port ' + port)
})

let io = require('socket.io')(server)
let Gpio = require('onoff').Gpio
let LED = new Gpio(4, 'out')

io.on('connection', function (socket) {
  let lightValue = 0 // static variable for current status
  socket.on('light', function (data) { // get light switch status from client
    lightValue = data
    if (lightValue != LED.readSync()) { // only change LED if status has changed
      LED.writeSync(lightValue) // turn LED on or off
    }
  })
})

process.on('SIGINT', function () {
  LED.writeSync(0) // turn LED off
  LED.unexport() // Unexport LED GPIO to free resources
  process.exit() // exit completely
})
