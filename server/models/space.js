'use strict';

var request = require('request'),
    host = 'http://nranv.sb02.stations.graphenedb.com',
    port = 24789,
    username = 'nranv',
    password = '6HSph7AFToCYPOWj8lCz',
    // httpUrlForTransaction =  host + ':' + port,
    httpUrlForTransactionDB = host + ':' + port + '/db/data/transaction/commit',
    auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64'),
    _ = require('underscore');

function Space(){
}

Space.createOne = function(spaceObj, cb){
  //retrieve cosmos
  // check if space already exists
  // create a new one
  console.log('spaceObj in model', spaceObj);
  runCypherQuery(
    'MATCH (cosmos:Cosmos) WHERE cosmos.cosmosName = {cosmosName} AND cosmos.cosmosCreator = {creatorName} OR {creatorName} in cosmos.cosmosMembers CREATE UNIQUE (cosmos)-[includesspace:INCLUDESSPACE]->(space:Space {name: {spaceName}, creator: {creatorName}, cosmos: {cosmosName}}) RETURN space',
     {
      spaceName: spaceObj.spaceName,
      cosmosName: spaceObj.cosmosName,
      creatorName: spaceObj.creatorName
     }, function(err, resp){
        if(err !== null){
          console.log('err', err);
        } else {
          console.log('resp', resp);
          cb(resp);
        }
     }
  );
};

Space.getOne = function(spaceObj, cb){
  runCypherQuery(
    'OPTIONAL MATCH (space:Space)-[node_belongs_to:NODE_BELONGS_TO]-(node) WHERE space.name = {name} AND space.creator = {user} OPTIONAL MATCH (space:Space)-[axon_belongs_to:AXON_BELONGS_TO]-(axon) WHERE space.name = {name} AND space.creator = {user} RETURN node, axon',
     {
      name: spaceObj.spaceName,
      user: spaceObj.email
     }, function(err, resp){
        if(err !== null){
          console.log('err', err);
        } else {
          console.log('resp', resp.results[0].data);
          var allNodes = [],
              allAxons = [];
          for(var i = 0; i < resp.results[0].data.length; i++){
              allNodes.push(resp.results[0].data[i].row[0]);
              allAxons.push(resp.results[0].data[i].row[1]);
          }
          if(allNodes.length > 0 && allNodes[0] !== null){
            allNodes = _.uniq(allNodes, function(node){
              return node.n;
            });
          }
          if(allAxons.length > 0 && allAxons[0] !== null){
            allAxons = _.uniq(allAxons, function(axon){
              return axon.bn;
            });
          }
          if(allAxons[0] === null){
            allAxons = [];
          }
          if(allNodes[0] === null){
            allNodes = [];
          }
          console.log('uniq nodes', allNodes);
          console.log('uniq axons', allAxons);
          cb({nodes: allNodes, axons: allAxons});
        }
     }
  );
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

// empty cypher snippet
// runCypherQuery(
//   '',
//   {

//   }, function(err, resp){

//   }
// );

module.exports = Space;

