'use strict';

var User = require('../models/user'),
    sess;

exports.status = function(req, res){
  sess= req.session;
  // console.log(req);
  if(sess.email){
  res.status(200).send({email: sess.email}).end();
  } else {
    res.status(400).end();
  }
};

exports.register = function(req, res){
  User.register(req.body, function(email){
    // console.log('email in register', email);
    if(email !== null){
      res.status(200).end();
    }else{
      res.status(400).end();
    }
  });
};

exports.login = function(req, res){
  sess= req.session;
  User.login(req.body, function(email){
    // console.log('email returning in server controllers login', email);
    if(email !== null){
        sess.email = email;
        res.status(200).end();
    }else{
      res.status(401).end();
    }
  });
};

exports.logout = function(req, res){
  sess=req.session;
  sess.destroy(function(){
    res.status(200).end();
  });
};

// exports.oauthCallback = function(strategy){
//   return function(req, res, next){
//     passport.authenticate(strategy, function(err, user, redirectURL){
//       if(err || !user){
//         return res.redirect('/#/');
//       }
//       req.login(user, function(err){
//         if (err) {
//           return res.redirect('/#/');
//         }

//         return res.redirect(redirectURL || '/');
//       });
//     })(req, res, next);
//   };
// };


