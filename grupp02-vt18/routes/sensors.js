let router = require('express').Router();
let resources = require('./../resources/model');

// GET all sensors
router.route('/').get(function (req, res, next) {
	req.result = resources.pi.sensors;
	next();
});

// GET the passive infrared sensor
router.route('/pir').get(function (req, res, next) {
	req.result = resources.pi.sensors.pir;
	next();
});

module.exports = router;