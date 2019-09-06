/**
 * Routes
*/

'use strict'

let router = require('express').Router();
let moment = require('moment');
let ledPlugin = require('./../plugins/internal/ledPlugin');
let pirPlugin = require('./../plugins/internal/pirPlugin');

// GET UI
router.route('/').get(function (req, res) {
	let date = moment().format("YYYY-MM-DD, HH:mm");

	let io = req.app.get('socket');
	let lightValue = req.app.get('lightValue');

	io.on('connection', function (socket) {
		// checks if greenLed has been turned on from pi
		if (lightValue === 1) {
			socket.emit('alarmBtn', lightValue);
		} else {
			socket.emit('alarmBtn', 0);
		}

		// turn on/off greenLed from UI
		socket.on('alarmBtn', function (data) {
			ledPlugin.updateLedValue(1, data);

			// turn on sensor from ui if it isn't turned on from pi
			if (!req.app.get('alarmStatus')) {
				if (data === 1) {
					req.app.set('uiStatus', true);
					pirPlugin.start({ 'simulate': false, 'frequency': 2000, 'socket': io });
					ledPlugin.start();
				}
			}

			// turn off sensor from ui if it's turned on from pi/ui
			if (req.app.get('alarmStatus') || req.app.get('uiStatus')) {
				if (data === 0) {
					req.app.set('uiStatus', false);
					socket.emit('alarmText', 0);
					pirPlugin.stop();
				}
			}
		});
	});

	res.render('home/index', { data: date });
});

module.exports = router;
