'use strict';
var Cosmo = require('../models/cosmo.js');

exports.createOne = function(req, res){
	Cosmo.createOne(req.body, function(response){
		console.log('response after saving one cosmos>>>>>>>>>>>', response);
		if(response === null){
			res.send(400).end();
		} else {
			res.send(response);
		}
	});
};

exports.getAllPersonal = function(req, res){
	Cosmo.getAllPersonal(req.body, function(response){
		console.log('response after getting all personal cosmos>>>>>>>>>>', response);
		if(response === null){
			res.send(400).end();
		} else {
			res.send(response);
		}
	});
};

exports.getOne = function(req, res){
	Cosmo.getOne(req.body, function(response){
		console.log('response after getting all personal cosmos>>>>>>>>>>', response);
		if(response === null){
			res.send(400).end();
		} else {
			res.send(response);
		}
	});
};


