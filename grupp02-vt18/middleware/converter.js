'use strict';

/**
 * Middleware converter from WoT book
*/

// require the two modules and instantiate a MessagePack encoder
let msgpack = require('msgpack5')(),
encode = msgpack.encode,
json2html = require('node-json2html');

// middleware = a function returning a function
module.exports = function() {
	return function (req, res, next) {
		console.info('Representation converter middleware called!');

		// check if the previous middleware left a result for you in req.result
		if (req.result) {
			// read the request header and check if the client requested JSON
			if (req.accepts('json')) {
				console.info('JSON representation selected!');
				res.send(req.result);
				return;
			}

			// if html was requested, use json2html to transform the JSON into simple HTML
			if (req.accepts('html')) {
				console.info('HTML representation selected!');
				let transform = { 'tag': 'div', 'html': '${name} : ${value}' };
				res.send(json2html.transform(req.result, transform));
				return;
			}

			// encode the JSON result into MessagePack using the encoder and return the result to the client
			if (req.accepts('application/x-msgpack')) {
				console.info('MessagePack representation selected!');
				res.type('application/x-msgpack');
				res.send(encode(req.result));
				return;
			}

			console.info('Defaulting to JSON representation!');

			// for all other formats, default to JSON
			res.send(req.result);
			return;
		} else {
			// if no result was present in req.result, call next middleware
			next();
		}
	}
}