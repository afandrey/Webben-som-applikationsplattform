let router = require('express').Router();
let resources = require('./../resources/model');

// GET all actuators
router.route('/').get(function (req, res, next) {
	req.result = resources.pi.actuators;
	next();
});

// GET the push button
router.route('/button').get(function (req, res, next) {
	req.result = resources.pi.actuators.button;
	next();
});

// GET all leds
router.route('/leds').get(function (req, res, next) {
	req.result = resources.pi.actuators.leds;
	next();
});

// GET specific led with id
router.route('/leds/:id').get(function (req, res, next) {
	req.result = resources.pi.actuators.leds[req.params.id];
	next();
}).put(function (req, res, next) {
	let Gpio = require('onoff').Gpio;
	let greenLed, redLed;
	
	let selectedLed = resources.pi.actuators.leds[req.params.id];
	selectedLed.value = req.body.value;
	
	// update and turn on greenLed
	// not the prettiest but could not do as in WoT book since Object.observer has been removed since apparently Node 5
	if (req.params.id === '1' && req.body.value === true) {
		greenLed = new Gpio(10, 'out');
		greenLed.writeSync(1);
		req.result = selectedLed;
		next();
	} else if (req.params.id === '1' && req.body.value === false) {
		greenLed = new Gpio(10, 'out');
		greenLed.writeSync(0);
		req.result = selectedLed;
		next();
	}
	// update and turn on redLed
	if (req.params.id === '2' && req.body.value === true) {
		redLed = new Gpio(22, 'out');
		redLed.writeSync(1);
		req.result = selectedLed;
		next();
	} else if (req.params.id === '2' && req.body.value === false) {
		redLed = new Gpio(22, 'out');
		redLed.writeSync(0);
		req.result = selectedLed;
		next();
	}
});

module.exports = router;