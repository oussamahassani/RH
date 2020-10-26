const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken') ;
const config = require('../config/database');
const mongoose = require('mongoose');


router.post('/checkToken', function(req, res, next) {
    var token = req.body.token.slice(5);
        jwt.verify(token, config.secret, function(err, decoded) {
            if(err || !decoded){
                res.json(false);
                return;
            }
            res.json(true);;
          });
    });

    router.get('/getgroupes', function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Groupe.find().sort('-updatedAt').exec(function (err, groupes) {
          if (err) return next(err);
          res.json(groupes);
        });
      });

      router.get('/departs', function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Departement.find(function (err, departements) {
          if (err) return next(err);
          res.json(departements);
        });
      });


      router.get('/postes', function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Configuration.findOne({}, {postes:1, _id:0}).limit(1).exec(function (err, postes){
          if (err) return next(err);
          res.json(postes);
        });
      });

      router.get('/groupes', function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Groupe.find().sort('-updatedAt').exec(function (err, groupes) {
          if (err) return next(err);
          res.json(groupes);
        });
      });

      router.put('/finish/:id', function(req, res, next) {
        const MyClientSchema = require('../models/myClients');
        const conn = mongoose.createConnection(config.database, { useNewUrlParser: true,  useUnifiedTopology: false });
        const MyClient = conn.model('myClients', MyClientSchema);
        MyClient.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
            if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
              }else{
                  res.json({success:true, msg :"Creation avec succès"});
              } 
          });    
      });

      router.post('/registerUser', function(req, res, next) {
        if(req.body.responsable === ""){
          delete req.body.responsable;
        }
        req.body.isAdmin = true;
          var user = new global.App.clientModel[(req.subdomains[1])].User(req.body);
          user.save(function(err){
              if(err){
                  res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
              }else{
                  res.json({success:true, msg :"Utilisateur créé avec succès"});
              } 
          });
      });

    module.exports = router ;