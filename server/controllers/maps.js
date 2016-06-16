'use strict';
var Map = require('../models/map.js');

exports.save = function(req, res){
	// console.log('req.body', req.body);
	Map.saveAll(req.body, function(response){
		console.log('after saving all', response);
		res.send(response);
	});
};


exports.retrieve = function(req, res){
	Map.retrieveAll(function(response){
		console.log('after saving all', response);
		res.send(response);
	});
};

