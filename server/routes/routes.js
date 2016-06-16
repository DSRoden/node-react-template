'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    session        = require('express-session'),
    security       = require('../lib/security'),
    debug          = require('../lib/debug'),
    files          = require('../controllers/files'),


    multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(express.static(__dirname + '/../../public'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(bodyParser.json());
  app.use(methodOverride());

  app.use(session({secret: 'ssshhhhh'}));

  // app.use(security.authenticate);
  app.use(debug.info);
  //console.log('Express: Routes Loaded');
};

