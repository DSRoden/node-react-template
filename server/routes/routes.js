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
  app.post('/register', users.register);
  app.post('/login', users.login);

  app.use(security.bounce);
  app.post('/cosmosCreate', cosmos.createOne);
  app.post('/allMyCosmos', cosmos.getAllPersonal);
  app.post('/getOneCosmos', cosmos.getOne);
  // app.post('/deleteCosmos', cosmos.deleteOne);

  app.post('/createSpace', spaces.createOne);
  app.post('/getOneSpace', spaces.getOne);
  // app.post('/allSpaces', space.getAll);
  // app.post('/deleteSpace', space.deleteOne);

  // app.post('/savenode', nodes.saveAxons);
  app.post('/saveMap', maps.save);
  app.get('/retrieveMap', maps.retrieve);

  app.post('/saveNode', nodes.saveOne);
  app.post('/deleteNode', nodes.deleteOne);

  app.post('/saveAxon', axons.saveOne);
  app.post('/getOneAxon', axons.getOneAxon);
  app.post('/deleteAxon', axons.deleteOne);
  app.get('/allnodes', nodes.retrieveAxons);

  app.post('/upload',  multipartyMiddleware, files.upload);
  app.get('/logout', users.logout);
  //console.log('Express: Routes Loaded');
};

