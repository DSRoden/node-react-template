'use strict';

var request = require('request'),
    host = 'http://nranv.sb02.stations.graphenedb.com',
    port = 24789,
    username = 'nranv',
    password = '6HSph7AFToCYPOWj8lCz',
    // httpUrlForTransaction =  host + ':' + port,
    httpUrlForTransactionDB = host + ':' + port + '/db/data/transaction/commit',
    auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

function Cosmo(){
}

Cosmo.createOne = function(cosmosObj, cb){
  console.log('cosmosObj', cosmosObj);
  var cosmosCreator = cosmosObj.cosmosCreator,
      cosmosName = cosmosObj.cosmosName,
      cosmosMembers = cosmosObj.cosmosTeam;
      console.log(cosmosName);
  runCypherQuery(
    'MATCH (cosmos: Cosmos) WHERE cosmos.cosmosName = {cosmosName} RETURN cosmos',
     {
      cosmosName: cosmosName
     }, function(err, resp){
      console.log(resp);
      if(resp.results[0].data.length === 0){
          console.log('error in adding user to neo4j', err);
          runCypherQuery(
              'CREATE (cosmos:Cosmos {cosmosName : {cosmosName}, cosmosCreator: {cosmosCreator}, cosmosMembers: {cosmosMembers}}) RETURN cosmos',
              {
                cosmosCreator : cosmosCreator,
                cosmosName : cosmosName,
                cosmosMembers : cosmosMembers
              }, function(err, resp){
                console.log('resp of adding cosmos', resp);
                if(err){
                  cb(null);
                } else {
                  console.log(resp);
                  cb(resp.results[0].data[0].row[0]);
                }
              }
          );
        } else {
          console.log('cosmo exists can\'t create', resp);
          cb(null);
        }
     }
  );
};

Cosmo.getAllPersonal = function(userObj, cb){
  console.log('userObj in Cosmos.getAll >>>>>>>>>>>>>>>>>', userObj);
  runCypherQuery(
    'MATCH (cosmos: Cosmos) WHERE cosmos.cosmosCreator = {userEmail} OR {userEmail} IN cosmos.cosmosMembers RETURN cosmos',
    {
      userEmail: userObj.email
    }, function(err, resp){
      if(err){
        console.log(err);
        cb(null);
      } else {
        console.log(resp);
        cb(resp.results[0].data);
      }
    }
  );
};

Cosmo.getOne = function(reqObj, cb){
  console.log('request object in Cosmos.getOne >>>>>>>>>>>>>>>>', reqObj);
  //get a cosmos and return all it's associated spaces
  runCypherQuery(
    'MATCH (cosmos {cosmosName: {cosmosName}})-[:INCLUDESSPACE]-(space) WHERE cosmos.cosmosCreator = {userEmail} OR {userEmail} IN cosmos.cosmosMembers RETURN space',
    {
      cosmosName: reqObj.cosmosName,
      userEmail: reqObj.email
    }, function(err, resp){
      if(err){
        console.log(err);
        cb(null);
      } else {
        console.log(resp.results[0].data);
        cb(resp.results[0].data);
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

module.exports = Cosmo;

