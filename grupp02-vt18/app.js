/**
 * Starting point of application
*/

'use strict';

let express = require('express');
let resources = require('./resources/model');
let converter = require('./middleware/converter');
let cors = require('cors');

let exphbs = require('express-handlebars');
let bodyParser = require('body-parser');
let path = require('path');

let app = express();

let http = require('http');
// let https = require('https');
// let fs = require('fs');

let Gpio = require('onoff').Gpio;
let greenLed = new Gpio(10, 'out');
let redLed = new Gpio(22, 'out');
let pushBtn = new Gpio(27, 'in', 'rising', { debounceTimeout: 10 });

// enable CORS support
app.use(cors());

// View engine
app.engine('.hbs', exphbs({
	defaultLayout: 'main',
	extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/pi'));
app.use('/pi/actuators', require('./routes/actuators'));
app.use('/pi/sensors', require('./routes/sensors'));
app.use('/pi/ui', require('./routes/ui'));

app.use(converter());

// Starting the server
/*let server = https.createServer({
	key: fs.readFileSync('./config/sslcerts/key.pem'),
	cert: fs.readFileSync('./config/sslcerts/cert.pem')
}, app).listen(resources.pi.port, function () {
	console.log('Your WoT Pi is up and running on port %s', resources.pi.port);
});*/

let server = http.createServer(app);
server.listen(resources.pi.port, function () {
	console.log('Your WoT Pi is up and running on port %s', resources.pi.port);
});

// Create the websocket server
let io = require('socket.io')(server);
app.set('socket', io);
app.set('uiStatus', false);

// Require all plugins needed
let buttonPlugin = require('./plugins/internal/buttonPlugin');

// must be started here or else button won't work without entering UI
buttonPlugin.start({ 'simulate': false, 'frequency': 2000, 'socket': io, 'app': app });