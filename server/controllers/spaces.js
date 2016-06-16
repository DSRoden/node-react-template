'use strict';
var Space = require('../models/space.js');

exports.createOne = function(req, res){
	console.log('req.body in creating space controller', req.body);
	Space.createOne(req.body, function(response){
		console.log('response after saving one cosmos>>>>>>>>>>>', response);
		if(response === null){
			res.send(400).end();
		} else {
			res.send(response);
		}
	});
};

exports.getOne = function(req, res){
	console.log('req.body in get onoe space controller', req.body);
	Space.getOne(req.body, function(response){
		console.log('response after saving one cosmos>>>>>>>>>>>', response);
		if(response === null){
			res.send(400).end();
		} else {
			res.send(response);
		}
	});
};

