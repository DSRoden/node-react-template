'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    session        = require('express-session'),
    security       = require('../lib/security'),
    debug          = require('../lib/debug'),
    users          = require('../controllers/users'),
    files          = require('../controllers/files'),
    nodes          = require('../controllers/nodes'),
    axons         = require('../controllers/axons'),
    maps           = require('../controllers/maps'),
    cosmos         = require('../controllers/cosmos'),
    spaces          = require('../controllers/spaces'),

    multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty();

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(express.static(__dirname + '/../../public'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(bodyParser.json());
  app.use(methodOverride());

  app.use(session({secret: 'ssshhhhh'}));
  app.get('/status', users.status);

  // app.use(security.authenticate);
  app.use(debug.info);
  //console.log('Express: Routes Loaded');
};

