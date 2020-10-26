const express = require('express');
const router = express.Router();
const passport  = require('passport') ; 
const jwt = require('jsonwebtoken') ;
const config = require('../config/database');
var bcrypt = require('bcrypt-nodejs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

router.post('/create', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var pret = new global.App.clientModel[(req.subdomains[1])].Pret();
    pret.montant= req.body.montant;
    pret.responsable    = req.body.responsable;
    pret.datesoumission    = req.body.datesoumission;
    pret.raison    = req.body.raison;
    pret.document = req.body.document;
    pret.remarque = req.body.remarque;
    pret.pretaccorde = req.body.pretaccorde;
    pret.garantie = req.body.garantie;
    pret.save(function(err){
        if(err){
            res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
        }else{
            res.json({success:true, msg :"pret créé avec succès"});
        } 
    });
});

router.put('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Pret.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);      
    res.json(post);
});

  });

  router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Pret.find(function (err, prets) {
      if (err) return next(err);
      res.json(prets);
    });
  });

  router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Pret.findById(req.params.id, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  });

  router.delete('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Pret.findByIdAndRemove(req.params.id, req.body, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  });


module.exports = router ;