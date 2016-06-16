'use strict';

var request = require('request'),
    host = 'http://nranv.sb02.stations.graphenedb.com',
    port = 24789,
    username = 'nranv',
    password = '6HSph7AFToCYPOWj8lCz',
    // httpUrlForTransaction =  host + ':' + port,
    httpUrlForTransactionDB = host + ':' + port + '/db/data/transaction/commit',
    auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

function AxonModel(){
}

// Object.defineProperty(User, 'collection', {
//   get: function(){return global.mongodb.collection('users');}
// });

AxonModel.saveOne = function(axon, cb){
  // console.log('saveOne axon in model', axon);
  runCypherQuery('MATCH (space:Space) WHERE space.name = {spaceName} AND space.creator = {spaceCreator} CREATE UNIQUE (space)-[axon_belongs_to:AXON_BELONGS_TO]->(axon:Axon {bn: {bn}, draggable1n: {draggable1n}, draggable1Pos: {draggable1Pos}, draggable2n: {draggable2n}, draggable2Pos: {draggable2Pos}, length : {length}, angle: {angle}}) RETURN axon', {
    draggable1n: (axon.draggable1.n),
    draggable1Pos: (axon.draggable1.position),
    draggable2n: (axon.draggable2.n),
    draggable2Pos: (axon.draggable2.position),
    length: (axon.length),
    angle: (axon.angle),
    bn: (axon.bn),
    spaceName: (axon.spaceName),
    spaceCreator: (axon.email)
  }, function(err, resp){
    if(err !== null){
      console.log('error creating axon', err);
      cb(null);
    }
    console.log('resp from creating axon', resp);
    cb(resp.results[0].data[0].row[0]);
  });
};

AxonModel.getOne = function(axonId, cb){
  // console.log('getONe axon in model', axonId);
  runCypherQuery('MATCH (axon:Axon) WHERE axon.bn = {id} RETURN axon', {
    id: axonId.axonId
  }, function(err, resp){
      if(err !== null){
        console.log('error getting axon', err);
      } else {
        console.log('responses getting axon', resp.results[0].data[0]);
        var retrievedAxon = resp.results[0].data[0];
        cb(retrievedAxon);
      }
  });
};

AxonModel.deleteOne = function(axon, cb){
  console.log('deleteOne node in model', axon);
  runCypherQuery('MATCH (cosmos:Cosmos)-[includesspace:INCLUDESSPACE]-(space:Space)-[axon_belongs_to:AXON_BELONGS_TO]-(axon:Axon) WHERE cosmos.cosmosName = {cosmosName} AND space.name = {spaceName} AND axon.bn = {bn} DELETE axon, axon_belongs_to', {
    bn: axon.bn,
    cosmosName: axon.cosmosName,
    spaceName: axon.spaceName
  }, function(err, resp){
      if(err){
        console.log('error in deleting node', err);
      } else {
        console.log('resp deleting axon', resp);
        cb(resp);
      }
    }
  );
};

AxonModel.saveAll = function(nodes, cb){
  console.log('nodes', nodes);
  var counter = 0;
  for(var i = 0; i < nodes.length; i++){
    console.log('running cypher', counter);
    runCypherQuery(
        'CREATE (axon:Axon {bn: {bn}, draggable1n: {draggable1n}, draggable1Pos: {draggable1Pos}, draggable2n: {draggable2n}, draggable2Pos: {draggable2Pos}, length : {length}, angle: {angle}}) RETURN axon', {
          draggable1n: (nodes[i].draggable1.n),
          draggable1Pos: (nodes[i].draggable1.position),
          draggable2n: (nodes[i].draggable2.n),
          draggable2Pos: (nodes[i].draggable2.position),
          length: (nodes[i].length),
          angle: (nodes[i].angle),
          bn: (nodes[i].bn)
        }, function(err, resp){
          if(err){
            console.log('error in adding axon to neo4j', err);
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
};

AxonModel.retrieveAll = function(cb){
  runCypherQuery(
    'MATCH(node:Axon)  RETURN node', {},
    function(err, resp){
      if(err){
        console.log('error in retrieving axons', err);
      } else {
        console.log('response retrieving axons', resp);
        cb(resp);
      }
    }
    );
};

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

// MATCH(node:Axon) WHERE node.bn = 1 Return node
// MATCH(node:Axon)  Return node
module.exports = AxonModel;

