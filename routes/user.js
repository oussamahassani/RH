const express = require('express');
const router = express.Router();
const passport  = require('passport') ; 
const jwt = require('jsonwebtoken') ;
const config = require('../config/database');
var bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
checkRoles = require('../middlewares/acl');

    router.post('/register', passport.authenticate('jwt', {session: false}), checkRoles(['usersCreate']), function(req, res, next) {
      if(req.body.responsable === ""){
        delete req.body.responsable;
      }
        var user = new global.App.clientModel[(req.subdomains[1])].User(req.body);
        user.save(function(err){
            if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Utilisateur créé avec succès"});
            } 
        });
    });


    router.put('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['usersUpdate']), function(req, res, next) {
      
    if(!req.body.responsable){
      delete req.body.responsable;
     }
        if(req.body.password && req.body.password.length < 50){
        bcrypt.hash(req.body.password, null , null , function(err,hash){
            if(err) return next(err);
              req.body.password = hash;
     
        global.App.clientModel[(req.subdomains[1])].User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
          if(err){
              res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Mise à jour aves succès"});
            } 
        });
    });
}
else{  
    delete req.body.password;
    delete req.body.cpassword;
    global.App.clientModel[(req.subdomains[1])].User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
      if(err){
        console.dir(err);
            res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
        }else{
            res.json({success:true, msg :"Mise à jour aves succès"});
        } 
    });
    }
   });
   

    router.post('/auth', (req, res, next) => {
      console.log("auth",req.body)
        const email = req.body.email ;
        const password = req.body.password ;
            global.App.clientModel[(req.subdomains[1])].User.findOne({email:email}, (err, user) =>{
            if(err) console.log(err + global.App.clientModel[(req.subdomains[1])]) ;
            if(!user){
                return res.json({success : false, msg : "L ' email entré ne correspond à aucun compte"});
            }
            bcrypt.compare(password,user.password, (err, isMatch) => {
              if(err) throw err ;
            if(isMatch){
              global.App.clientModel[(req.subdomains[1])].Groupe.find({"_id" : {$in : user.permissions} }, { _id: 0, permissions: 1 }).sort('-updatedAt').exec(function (err, groupes) {
                if (err) return next(err);
                
              delete user.password;
              let userToken = new global.App.clientModel[(req.subdomains[1])].User(user);
              let finalToken = userToken.toJSON()
              delete finalToken.password;
              finalToken.isClient = false;
              finalToken.subdomain = req.subdomains[1];
              finalToken.permissions = [...new Set(groupes[0].permissions)];
               const token = jwt.sign(finalToken, config.secret, {
                    expiresIn: 28800 
                });
                res.json({
                    grade: user.grade,
                    success : true,
                    token : 'XPRS '+token
                })
              });
            }
            else{
                return res.json({success : false, msg : "Mot de passe incorrect"}); 
            }
            });

            
        });
     });

     router.get('/', passport.authenticate('jwt', {session: false, passReqToCallback: true}), checkRoles(['usersView']), function(req, res){
        global.App.clientModel[(req.subdomains[1])].User.find(function (err, users) {
          if (err) return next(err);
          res.json(users);
        });
      });

   

      router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          res.json({success:false, msg :"Id Incorrecte"});
          return;
        }
        global.App.clientModel[(req.subdomains[1])].User.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

      router.get('/login/:id', function(req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          res.json({success:false, msg :"Id invalide"});
          return;
        }
        global.App.clientModel[(req.subdomains[1])].User.find({'_id': req.params.id}, {"username": 1, "email": 1, "image": 1, "_id": 0},function (err, post) {
          if (err) return next(err);
          res.json({success: true, msg: "success", user: post});
        });
      });
      
      
  router.get('/getUsersByDepart/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].User.find({},{ _id: 1, grade: 1, fname: 1, lname: 1}).exec( function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  });

  router.get('/getOneUserConge/:id', passport.authenticate('jwt', {session: false}), checkRoles(['rh']), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].User.find({"_id" : req.params.id },{ _id: 1, 'contrat.conge' : 1}).exec( function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
  router.get('/getOneUser/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
     global.App.clientModel[(req.subdomains[1])].User.findOne({"_id" : req.params.id },{ _id: 1, fname: 1, lname: 1, cin: 1, datecommencement:1}).exec( function (err, post) {
              if (err) return next(err);
              res.json(post);
            });
          });
      
     
     



module.exports = router ;