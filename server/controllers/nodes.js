'use strict';
var NodeModel = require('../models/node.js');

exports.saveAxons = function(req, res){
	// console.log('req.body', req.body);
	NodeModel.saveAll(req.body, function(response){
		console.log('response from node.save, controller>>>>>>', response);
		console.log('response ', response.results[0].columns);
		console.log('response ', response.results[0].data[0].row[0]);
		var axonInfo = response.results[0].data[0].row[0];
		res.send({axon: axonInfo});
	});
};

exports.retrieveAxons = function(req, res){
	NodeModel.retrieveAll(function(response){
		console.log('response in controller for receing axons', response.results[0].data);
		var allNodes = response.results[0].data;
		res.send(allNodes);
	});
};

exports.deleteOne = function(req, res){
	// console.log('req.body in deleteOne', req.body);
	NodeModel.deleteOne((req.body), function(response){
		console.log('deleteOne res in server controller', response);
		res.send(response).end();
	});
};

exports.saveOne = function(req, res){
	// console.log('req.body in saveOne', req.body);
	NodeModel.saveOne((req.body), function(response){
		console.log('saveOne res in server controller', response);
		res.send(response).end();
	});
};

