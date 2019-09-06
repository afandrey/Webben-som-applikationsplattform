let router = require('express').Router();
let resources = require('./../resources/model');

// redirect
router.route('/').get(function (req, res, next) {
	res.redirect('/pi');
});

// GET all links
router.route('/pi').get(function (req, res, next) {
	req.result = resources.pi.links;
	next();
});

// GET all actions
router.route('/pi/actions').get(function (req, res, next) {
	req.result = resources.pi.actions;
	next();
});

module.exports = router;