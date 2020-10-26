const express = require('express');
const router = express.Router();
const passport  = require('passport') ; 
const jwt = require('jsonwebtoken') ;
const config = require('../config/database');
var bcrypt = require('bcrypt-nodejs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
checkRoles = require('../middlewares/acl'); 

router.post('/create', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var avance = new global.App.clientModel[(req.subdomains[1])].Avancesalaire();
    avance.montant= req.body.montant;
    avance.responsable    = req.body.responsable;
    avance.datesoumission    = req.body.datesoumission;
    avance.raison    = req.body.raison;
    avance.document = req.body.document;
    avance.remarque = req.body.remarque;
    avance.save(function(err){
        if(err){
            res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
        }else{
            res.json({success:true, msg :"avance créé avec succès"});
        } 
    });
});

router.put('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['rh','rhUpdate']), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Avancesalaire.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);      
    res.json(post);
});

  });

  router.get('/', passport.authenticate('jwt', {session: false}), checkRoles(['rhView']), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Avancesalaire.find(function (err, avancesalaires) {
      if (err) return next(err);
      res.json(avancesalaires);
    });
  });

  router.get('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['rh','rhView']), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Avancesalaire.findById(req.params.id, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  });

  router.delete('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['rhDelete']), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Avancesalaire.findByIdAndRemove(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  });


module.exports = router ;