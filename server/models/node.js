'use strict';

var request = require('request'),
    host = 'http://nranv.sb02.stations.graphenedb.com',
    port = 24789,
    username = 'nranv',
    password = '6HSph7AFToCYPOWj8lCz',
    // httpUrlForTransaction =  host + ':' + port,
    httpUrlForTransactionDB = host + ':' + port + '/db/data/transaction/commit',
    auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

function NodeModel(){
}

// Object.defineProperty(User, 'collection', {
//   get: function(){return global.mongodb.collection('users');}
// });

NodeModel.saveOne = function(node, cb){
  // console.log('saveOne node in model', node);
  runCypherQuery('MATCH (space:Space) WHERE space.name = {spaceName} AND space.creator = {spaceCreator} CREATE UNIQUE (space)-[node_belongs_to:NODE_BELONGS_TO]->(node:Node {n: {n}, position: {position}, label: {label}, shortDescription: {shortDescription}, notes: {notes}, catTags: {catTags}, peopleTags: {peopleTags}, uploadUrls: {uploadUrls}}) RETURN node', {
    n: node.n,
    position: node.position,
    label: node.label,
    shortDescription: node.shortDescription,
    notes: node.notes,
    catTags: node.categoryTags,
    peopleTags: node.peopleTags,
    uploadUrls: node.uploadUrls,
    spaceName: node.spaceName,
    spaceCreator: node.spaceCreator
  }, function(err, resp){
    console.log('err', err);
    console.log('resp', resp);
    cb(resp.results[0].data[0].row[0]);
  });
};

NodeModel.deleteOne = function(node, cb){
  console.log('deleteOne node in model', node);
  runCypherQuery('MATCH (cosmos:Cosmos)-[includesspace:INCLUDESSPACE]-(space:Space)-[node_belongs_to:NODE_BELONGS_TO]-(node:Node)  WHERE cosmos.cosmosName = {cosmosName} AND space.name = {spaceName} AND node.n = {n} DELETE node, node_belongs_to', {
    n: node.n,
    cosmosName: node.cosmosName,
    spaceName: node.spaceName
  }, function(err, resp){
      if(err){
        console.log('error in deleting node', err);
      } else {
        runCypherQuery('MATCH (cosmos:Cosmos)-[includesspace:INCLUDESSPACE]-(space:Space)-[axon_belongs_to:AXON_BELONGS_TO]-(axon: Axon) WHERE cosmos.cosmosName = {cosmosName} AND space.name = {spaceName} AND axon.draggable1n = {n} OR axon.draggable2n = {n} DELETE axon, axon_belongs_to', {
          n: node.n,
          cosmosName: node.cosmosName,
          spaceName: node.spaceName
        }, function(err2, resp2){
            if(err2){
              console.log('error in deleting axons', err2);
            } else {
              console.log('response', resp2);
              cb(resp);
            }
          }
        );
      }
    }
  );
};

//-will save all nodes but not with relationships
NodeModel.saveAll = function(nodes, cb){
  console.log('nodes', nodes);
  var counter = 0;
  for(var i = 0; i < nodes.length; i++){
    console.log('running cypher', counter);
    runCypherQuery(
        'CREATE (node:Axon {bn: {bn}, draggable1n: {draggable1n}, draggable1Pos: {draggable1Pos}, draggable2n: {draggable2n}, draggable2Pos: {draggable2Pos}, length : {length}, angle: {angle}}) RETURN node', {
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

//will retrive all nodes in the system
NodeModel.retrieveAll = function(cb){
  runCypherQuery(
    'MATCH(node:Node)  RETURN node', {},
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

//function that fires the cypher query.
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

module.exports = NodeModel;

