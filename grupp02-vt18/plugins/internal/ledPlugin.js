let resources = require('./../../resources/model');
let request = require('request');

let actuator, interval;
let model = resources.pi.actuators.leds['2'];
let pluginName = model.name;

exports.start = function () {
	connectHardware();
};

exports.stop = function () {
	clearInterval(interval);
	actuator.unexport();
	console.info('%s plugin stopped!', pluginName);
};

exports.blink = function (value) {
	// blink redLed when alarm goes off
	if (value === 1) {
		interval = setInterval(blinkLED, 250);
	}
};

function blinkLED () {
	if (actuator.readSync() === 0) {
		actuator.writeSync(1);
	} else {
		actuator.writeSync(0);
	}
};

function connectHardware() {
	let Gpio = require('onoff').Gpio;
	actuator = new Gpio(model.gpio, 'out');
	console.info('Hardware %s actuator started!', pluginName);
};

exports.updateLedValue = function (id, value) {
	let ledURL = 'http://c0eea0f2.ngrok.io/pi/actuators/leds/' + id;

	let updatedVal;
	if (value === 1) {
		updatedVal = true;
	} else {
		updatedVal = false;
	}

	request.put(ledURL, {
		headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
		body: JSON.stringify({
			'value': updatedVal
		})
	});
};

function showValue() {
	console.info(model.value ? 'turned on' : 'turned off');
}