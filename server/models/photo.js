'use strict';


var AWS    = require('aws-sdk'),
    npath   = require('path'),
    crypto = require('crypto'),
    concat = require('concat-stream'),
    fs      = require('fs');

function Photo(o){
  this.url = o.url;
}

Object.defineProperty(Photo, 'collection', {
  get: function(){return global.mongodb.collection('photos');}
});


Photo.upload = function(file, cb){
  console.log('file', file.file.path);
  var s3   = new AWS.S3(),
  read = fs.createReadStream(file.file.path);

  crypto.randomBytes(48, function(ex, buf){
    var hex = buf.toString('hex'),
        loc = '/test/' + hex + npath.extname('otium'),
        url = 'https://s3.amazonaws.com/' + process.env.AWS_BUCKET + '/' + loc;

    console.log('buf', buf);
    var newUrl = new Photo({url : url});
    Photo.collection.save(newUrl, function(err){
      if(err){return cb(err);}
    read.pipe(concat(function(buf){
      var params = {Bucket: process.env.AWS_BUCKET, Key: loc, Body: buf, ACL: 'public-read'};
      s3.putObject(params, cb);
    }));
    });
  });
};

module.exports = Photo;

