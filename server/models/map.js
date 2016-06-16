'use strict';

var request = require('request'),
    host = 'http://nranv.sb02.stations.graphenedb.com',
    port = 24789,
    username = 'nranv',
    password = '6HSph7AFToCYPOWj8lCz',
    // httpUrlForTransaction =  host + ':' + port,
    httpUrlForTransactionDB = host + ':' + port + '/db/data/transaction/commit',
    auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

function Map(){
}

// Object.defineProperty(User, 'collection', {
//   get: function(){return global.mongodb.collection('users');}
// });

Map.saveAll = function(body, cb){
  console.log('save all in model', body);
  var nodes = body.nodes,
      axons = body.axons,
      cosSpace = {cosmosName: body.cosmosName, spaceName: body.spaceName};
    saveNodes(cosSpace, nodes, function(responseNodes){
      console.log('axons', axons);
      if(axons.length !== []){
        saveAxons(cosSpace, axons, function(responseAxons){
          var finalResponse = {rNodes : responseNodes, rAxons: responseAxons};
          cb(finalResponse);
        });
      } else {
        cb({rNodes : responseNodes});
      }
    });
};

Map.retrieveAll = function(cb){
  getNodes(function(nodes){
    getAxons(function(axons){
      var response = {nodes: nodes.results[0].data, axons: axons.results[0].data};
      cb(response);
    });
  });
};


//HELPER AND QUERY FUNCTIONS
//function which fires the cypher query.
function runCypherQuery(query, params, callback){
  request.post({
      uri: httpUrlForTransactionDB,
      json: {statements: [{statement: query, parameters: params}]},
      headers : {
            'Authorization' : auth
        }
    },
    function(err, res, body){
      callback(err, body);
    });
}

function saveNodes(cosSpace, nodes, cb){
  if(nodes.length === 0){cb();}
  var counter = 0;
  for(var i = 0; i < nodes.length; i++){
    console.log('node saving', nodes[i]);
    console.log(nodes[i].n);
    runCypherQuery(
      'MATCH (cosmos)-[includesspace: INCLUDESSPACE]-(space {name: {spaceName}})-[node_belongs_to:NODE_BELONGS_TO]-(node {n: {n}}) WHERE cosmos.cosmosName = {cosmosName} SET node.position = {position} RETURN node', {
        n: nodes[i].n,
        position: nodes[i].position,
        cosmosName: cosSpace.cosmosName,
        spaceName: cosSpace.spaceName
      },
      function(err, resp){
        if(err){
          console.log('error in retrieving axons', err);
        } else {
          console.log('response', resp);
          counter++;
          if(counter === nodes.length - 1){
            cb(resp);
          }
        }
      }
    );
  }
}

function saveAxons(cosSpace, axons, cb){
  console.log('cosSpace', cosSpace);
  if(axons.length === 0){cb();}
  var counter = 0;
  for(var i = 0; i < axons.length; i++){
    console.log('running cypher', counter);
    runCypherQuery(
        'MATCH (cosmos)-[includesspace: INCLUDESSPACE]-(space {name: {spaceName}})-[axon_belongs_to:AXON_BELONGS_TO]-(axon {bn: {bn}}) WHERE cosmos.cosmosName = {cosmosName} SET axon.draggable1n = {draggable1n}, axon.draggable1Pos = {draggable1Pos}, axon.draggable2n = {draggable2n}, axon.draggable2Pos = {draggable2Pos}, axon.length = {length}, axon.angle = {angle} RETURN axon', {
          draggable1n: (axons[i].draggable1.n),
          draggable1Pos: (axons[i].draggable1.position),
          draggable2n: (axons[i].draggable2.n),
          draggable2Pos: (axons[i].draggable2.position),
          length: (axons[i].length),
          angle: (axons[i].angle),
          bn: (axons[i].bn),
          cosmosName: cosSpace.cosmosName,
          spaceName: cosSpace.spaceName
        }, function(err, resp){
          if(err){
            console.log('error in adding axon to neo4j', err);
        } else {
            console.log('response', resp);
            counter++;
            if(counter === axons.length - 1){
              cb(resp);
            }
        }
      }
    );
  }
}

function getAxons(cb){
  runCypherQuery(
    'MATCH(axon:Axon)  RETURN axon', {},
    function(err, resp){
      if(err){
        console.log('error in retrieving axons', err);
      } else {
        console.log('response retrieving axons', resp);
        cb(resp);
      }
    }
  );
}

function getNodes(cb){
  runCypherQuery(
    'MATCH(node:Node)  RETURN node', {},
    function(err, resp){
      if(err){
        console.log('error in retrieving nodes', err);
      } else {
        console.log('response retrieving nodes', resp);
        cb(resp);
      }
    }
  );
}
// MATCH (n { name: 'Andres' })
// SET n.surname = 'Taylor'
// RETURN n
// MATCH(node:Axon) WHERE node.bn = 1 Return node
// MATCH(node:Axon)  Return node
module.exports = Map;

