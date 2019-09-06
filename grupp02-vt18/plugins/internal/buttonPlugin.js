let resources = require('./../../resources/model');

let interval, button;
let model = resources.pi.actuators.button;
let pluginName = resources.pi.actuators.button.name;
let ledPlugin = require('./ledPlugin');
let pirPlugin = require('./pirPlugin');
let localParams = { 'simulate': false, 'frequency': 2000 };

// starts the plugin
exports.start = function(params) {
	localParams = params;
	if (localParams.simulate) {
		simulate();
	} else {
		connectHardware(localParams.socket, localParams.app);
	}
};

// stops the plugin
exports.stop = function() {
	if (localParams.simulate) {
		clearInterval(interval);
	} else {
		button.unwatch();
	}
	console.info('%s plugin stopped!', pluginName);
};

// require and connect the actual hardware driver and configure it
function connectHardware(socket, app) {
	let Gpio = require('onoff').Gpio;
	let greenLed = new Gpio(10, 'out');
	
	// configure the GPIO pin to which the button is connected
	button = new Gpio(model.gpio, 'in', 'rising', { debounceTimeout: 10 });
	// start listening for GPIO events
	button.watch(function (err, value) {
		if (err) exit(err);

		let lightValue = greenLed.readSync() ^ 1;

		// turns on/off the greenLed from button
		ledPlugin.updateLedValue(1, lightValue);
		// change on/off button on UI
		socket.emit('alarmBtn', lightValue);
		// update on/off button on UI if opened after alarm been turned on
		app.set('lightValue', lightValue);

		// turn on sensor from pi if it isn't turned on from ui
		if (!app.get('uiStatus')) {
			if (lightValue === 1) {
				app.set('alarmStatus', true);
				pirPlugin.start({ 'simulate': false, 'frequency': 2000, 'socket': socket });
				ledPlugin.start();
			}
		}

		// turn off sensor with pi button
		if (app.get('alarmStatus')) {
			if (lightValue === 0) {
				app.set('alarmStatus', false);
				socket.emit('alarmText', 0);
				pirPlugin.stop();
			}
		}

		model.value = !!value;
	});
	console.info('Hardware %s started!', pluginName);
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
	console.info(model.value ? 'button pressed' : 'button not pressed');
};