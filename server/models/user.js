'use strict';

var bcrypt = require('bcrypt'),
    // Mongo  = require('mongodb'),
    request = require('request'),
    host = 'http://nranv.sb02.stations.graphenedb.com',
    port = 24789,
    username = 'nranv',
    password = '6HSph7AFToCYPOWj8lCz',
    // httpUrlForTransaction =  host + ':' + port,
    httpUrlForTransactionDB = host + ':' + port + '/db/data/transaction/commit',
    auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

function User(){
}

User.register = function(userObj, cb){
  var email = userObj.email,
      pw = userObj.password = bcrypt.hashSync(userObj.password, 10);
  runCypherQuery(
    'MATCH (user: User) WHERE user.email= {email} RETURN user',
     {
      email: email
     }, function(err, resp){
      console.log('response in register', resp.results[0].data.length);
      if(resp.results[0].data.length === 0){
          console.log('error in adding user to neo4j', err);
          runCypherQuery(
              'CREATE (user:User {email : {email}, password : {pw}}) RETURN user',
              {
                email: email,
                pw: pw
              }, function(err, resp){
                if(err){
                  cb(null);
                } else {
                  console.log('response from creating user', resp);
                  cb(resp.results[0].data[0].row[0].email);
                }
              }
          );
        } else {
          console.log('user exists don\'t register', resp);
          cb(null);
        }
     }
  );
};

User.login = function(userObj, cb){
  var email = userObj.email,
      pw = userObj.password;
  runCypherQuery(
    'MATCH(user: User) WHERE user.email= {email} RETURN user',
     {
      email: email
     }, function(err, resp){
      if(err){
          console.log('error in adding user to neo4j', err);
      } else {
          console.log('response', resp.results[0].data[0].row[0].password);
          var retrievedPW = resp.results[0].data[0].row[0].password,
              isOk = bcrypt.compareSync(pw, retrievedPW);
              console.log('pw', pw);
          if(isOk){
            cb(resp.results[0].data[0].row[0].email);
            console.log('pw match');
          } else {
            console.log('no match');
            cb(null);
          }
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

// function saveAxons(axons, cb){
//   if(axons.length === 0){cb();}
//   var counter = 0;
//   for(var i = 0; i < axons.length; i++){
//     console.log('running cypher', counter);
//     runCypherQuery(
//         'MERGE (axon:Axon {bn: {bn}}) ON CREATE SET axon.bn = {bn}, axon.draggable1n = {draggable1n}, axon.draggable1Pos = {draggable1Pos}, axon.draggable2n = {draggable2n}, axon.draggable2Pos = {draggable2Pos}, axon.length = {length}, axon.angle = {angle} ON MATCH SET axon.draggable1n = {draggable1n}, axon.draggable1Pos = {draggable1Pos}, axon.draggable2n = {draggable2n}, axon.draggable2Pos = {draggable2Pos}, axon.length = {length}, axon.angle = {angle} RETURN axon', {
//           draggable1n: (axons[i].draggable1.n),
//           draggable1Pos: (axons[i].draggable1.position),
//           draggable2n: (axons[i].draggable2.n),
//           draggable2Pos: (axons[i].draggable2.position),
//           length: (axons[i].length),
//           angle: (axons[i].angle),
//           bn: (axons[i].bn)
//         }, function(err, resp){
//           if(err){
//             console.log('error in adding axon to neo4j', err);
//         } else {
//             console.log('response', resp);
//             counter++;
//             if(counter === axons.length - 1){
//               cb(resp);
//             }
//         }
//       }
//     );
//   }
// }

// function getAxons(cb){
//   runCypherQuery(
//     'MATCH(axon:Axon)  RETURN axon', {},
//     function(err, resp){
//       if(err){
//         console.log('error in retrieving axons', err);
//       } else {
//         console.log('response retrieving axons', resp);
//         cb(resp);
//       }
//     }
//   );
// }

//mongo code

// Object.defineProperty(User, 'collection', {
//   get: function(){return global.mongodb.collection('users');}
// });

// User.findById = function(id, cb){
//   var _id = Mongo.ObjectID(id);
//   User.collection.findOne({_id:_id}, cb);
// };

// User.register = function(o, cb){
//   console.log('o', o);
//   User.collection.findOne({email:o.email}, function(err, user){
//     if(user || o.password.length < 3){return cb();}
//     o.password = bcrypt.hashSync(o.password, 10);
//     User.collection.save(o, cb);
//   });
// };

// User.login = function(o, cb){
//   User.collection.findOne({email:o.email}, function(err, user){
//     if(!user){return cb();}
//     var isOk = bcrypt.compareSync(o.password, user.password);
//     if(!isOk){return cb();}
//     cb(null, user);
//   });
// };

// User.facebookAuthenticate = function(token, secret, facebook, cb){
//   console.log('facebook authentication in user model, token', token);
//   User.collection.findOne({facebookId:facebook.id}, function(err, user){
//     if(user){return cb(null, user);}
//     user = {facebookId:facebook.id, username:facebook.displayName, displayName:facebook.displayName, email:facebook.displayName, type:'facebook', loc:{}, isPublic:true, photos: [], favorites :[]};
//     User.collection.save(user, cb);
//   });
// };

// User.twitterAuthenticate = function(token, secret, twitter, cb){
//   User.collection.findOne({twitterId:twitter.id}, function(err, user){
//     console.log('user from twitter authenticate', user);
//     if(user){
//       console.log('user', user);
//       return cb(null, user);
//     }
//     user = {twitterId:twitter.id, username:twitter.username, displayName:twitter.displayName,email:twitter.displayName, type:'twitter', loc:{}, isPublic:true, photos: [], favorites : []};
//     User.collection.save(user, function(user){
//       console.log('after saving', user);
//       cb();
//     });
//   });
// };

// User.twitterAuthenticate = function(token, secret, twitter, cb){
//   User.collection.findOne({twitterId:twitter.id}, function(err, user){
//     if(user){return cb(null, user);}
//     user = {twitterId:twitter.id, username:twitter.username, displayName:twitter.displayName,email:twitter.displayName, type:'twitter', loc:{}, isPublic:true, photos: [], favorites : []};
//     User.collection.save(user, cb);
//   });
// };

// User.googleAuthenticate = function(token, secret, google, cb){
//   console.log(google);
//   User.collection.findOne({googleId:google.id}, function(err, user){
//     if(user){return cb(null, user);}
//     user = {googleId:google.id, username:google.displayName, displayName:google.displayName,email:google.displayName, type:'google', loc:{}, isPublic:true, photos: [], favorites : []};
//     User.collection.save(user, cb);
//   });
// };

module.exports = User;

