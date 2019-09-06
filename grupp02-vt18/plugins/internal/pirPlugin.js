let resources = require('./../../resources/model');

let interval, sensor;
let model = resources.pi.sensors.pir;
let pluginName = resources.pi.sensors.pir.name;
let ledPlugin = require('./ledPlugin');
let localParams = { 'simulate': false, 'frequency': 2000 };

// starts the plugin
exports.start = function(params) {
	localParams = params;
	if (localParams.simulate) {
		simulate();
	} else {
		connectHardware(localParams.socket);
	}
};

// stops the plugin
exports.stop = function() {
	if (localParams.simulate) {
		clearInterval(interval);
	} else {
		sensor.unwatch();
		ledPlugin.stop();
	}
	console.info('%s plugin stopped!', pluginName);
};

// require and connect the actual hardware driver and configure it
function connectHardware(socket) {
	let Gpio = require('onoff').Gpio;
	// configure the GPIO pin to which the PIR sensor is connected
	sensor = new Gpio(model.gpio, 'in', 'both');
	// start listening for GPIO events
	sensor.watch(function (err, value) {
		if (err) exit(err);

		if (value === 1) {
			// blink redLed when alarm goes off
			ledPlugin.blink(value);

			// send info to UI that the alarm went off
			socket.emit('alarmText', value);
		}

		model.value = !!value;
		showValue();
	});
	console.info('Hardware %s sensor started!', pluginName);
};

// simulation mode for when developing or testing the code with no sensors connected
function simulate() {
	interval = setInterval(function () {
		model.value = !model.value;
		showValue();
	}, localParams.frequency);
	console.info('Simulated %s sensor started!', pluginName);
};

function showValue() {
	console.info(model.value ? 'there is someone!' : 'not anymore!');
};