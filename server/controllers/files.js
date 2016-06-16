'use strict';
var Photo = require('../models/photo.js');

exports.upload = function(req, res){
	// console.log(req.files);
	// console.log('server upload controller');
	// console.log(req.headers['content-type']);
	// var file = req.files[0];
	Photo.upload(req.files, function(response){
		console.log('after upload in controller', response);
		res.send({imageUrls: response});
	});
	// req.files('files').upload({
	// 	adapter: require('skipper-s3'),
	// 	key: process.env.AWS_KEY,
	// 	secret: process.env.AWS_SECRET,
	// 	bucket: process.env.AWS_BUCKET
	// }, function(err, response){
	// 	console.log('err', err);
	// 	console.log('response', response);
	// });
};
