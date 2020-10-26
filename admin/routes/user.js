const express = require('express');
const router = express.Router();
const passport  = require('passport') ; 
const jwt = require('jsonwebtoken') ;
const config = require('../config/database');
var bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

const AdminUserSchema = require('../models/adminUsers');
const conn = mongoose.createConnection(config.database, { useNewUrlParser: true,  useUnifiedTopology: false });
const AdminUser = conn.model('AdminUsers', AdminUserSchema);

    router.post('/register', passport.authenticate('admin', {session: false}), function(req, res, next) {
      if(req.body.responsable === ""){
        delete req.body.responsable;
      }
        var adminUser = AdminUser(req.body);
        adminUser.save(function(err){
            if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Utilisateur créé avec succès"});
            } 
        });
    });


    router.put('/:id', passport.authenticate('admin', {session: false}), function(req, res, next) {
        if(req.body.password && req.body.password.length < 50){
        bcrypt.hash(req.body.password, null , null , function(err,hash){
            if(err) return next(err);
              req.body.password = hash;
     
       AdminUser.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
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
    AdminUser.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
      if(err){
            res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
        }else{
            res.json({success:true, msg :"Mise à jour aves succès"});
        } 
    });
    }
   });
   

    router.post('/auth', (req, res, next) => {
        const email = req.body.email ;
        const password = req.body.password ;
            AdminUser.findOne({email:email}, (err, adminUser) =>{
            if(err) console.log(err + global.App.clientModel[(req.subdomains[1])]) ;
            if(!adminUser){
                return res.json({success : false, msg : "L'email entré ne correspond à aucun compte"});
            }
            bcrypt.compare(password,adminUser.password, (err, isMatch) => {
              if(err) throw err ;
            if(isMatch){
              delete adminUser.password;
              let adminUserToken = AdminUser(adminUser);
              let finalToken = adminUserToken.toJSON()
              delete finalToken.password;
              finalToken.isClient = false;
              finalToken.subdomain = req.subdomains[1];
               const token = jwt.sign(finalToken, config.secret, {
                    expiresIn: 28800 
                });
                res.json({
                    success : true,
                    token : 'XPRA '+token
                })
            }
            else{
                return res.json({success : false, msg : "Mot de passe incorrect"}); 
            }
            });

            
        });
     });

     router.get('/', passport.authenticate('admin', {session: false}), function(req, res, next) {
        AdminUser.find(function (err, adminUsers) {
          if (err) return next(err);
          res.json(adminUsers);
        });
      });

   

      router.get('/:id', passport.authenticate('admin', {session: false}), function(req, res, next) {
        AdminUser.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
      
  router.get('/getAdminUsersByDepart/', passport.authenticate('admin', {session: false}), function(req, res, next) {
    AdminUser.find({},{ _id: 1, grade: 1, fname: 1, lname: 1}).exec( function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  });

  router.get('/getOneAdminUserConge/:id', passport.authenticate('admin', {session: false}), function(req, res, next) {
    AdminUser.find({"_id" : req.params.id },{ _id: 1, 'contrat.conge' : 1}).exec( function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
  router.get('/getOneAdminUser/:id', passport.authenticate('admin', {session: false}), function(req, res, next) {
     AdminUser.findOne({"_id" : req.params.id },{ _id: 1, fname: 1, lname: 1, cin: 1, datecommencement:1}).exec( function (err, post) {
              if (err) return next(err);
              res.json(post);
            });
          });
      
     
     



module.exports = router ;