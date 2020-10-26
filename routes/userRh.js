const express = require('express');
const router = express.Router();
const passport  = require('passport') ; 
const jwt = require('jsonwebtoken') ;
const config = require('../config/database');
var bcrypt = require('bcrypt-nodejs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

router.post('/create', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var user = new global.App.clientModel[(req.subdomains[1])].UserRh();
    user.username= req.body.username;
    user.fname    = req.body.fname;
    user.lname    = req.body.lname;
    user.email    = req.body.email;
    user.adress = req.body.adress;
    user.sexe = req.body.sexe;
    user.tel = req.body.tel;
    user.cin = req.body.cin;
    user.salairebrut = req.body.salairebrut;
    user.salairenet = req.body.salairenet;
    user.datenaissance = req.body.datenaissance;
    user.poste = req.body.poste;
    user.grade = req.body.grade;
    user.departement = req.body.departement;
    user.service = req.body.service;
    user.responsable = req.body.responsable;
    user.anciente = req.body.anciente;
    user.datecommencement = req.body.datecommencement;
    user.contrat = req.body.contrat;
    user.save(function(err){
        if(err){
            res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
        }else{
            res.json({success:true, msg :"Utilisateur créé avec succès"});
        } 
    });
});

router.put('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    


    global.App.clientModel[(req.subdomains[1])].UserRh.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);      
    res.json(post);
});

  });

  router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].UserRh.find(function (err, usersRh) {
      if (err) return next(err);
      res.json(usersRh);
    });
  });



  router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].UserRh.findById(req.params.id, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  });

  
  router.get('/getUsersByDepart/:dept', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].UserRh.find({"departement" : req.params.dept },{ _id: 1, fname: 1, lname: 1}).exec( function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  });
  
  router.get('/getOneUserConge/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].UserRh.find({"_id" : req.params.id },{ _id: 1, 'contrat.conge' : 1}).exec( function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
  router.get('/getOneUser/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
     global.App.clientModel[(req.subdomains[1])].UserRh.findOne({"_id" : req.params.id },{ _id: 1, fname: 1, lname: 1, cin: 1, datecommencement:1}).exec( function (err, post) {
              if (err) return next(err);
              res.json(post);
            });
          });
  
  
  router.delete('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].UserRh.findByIdAndRemove(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  });


module.exports = router ;