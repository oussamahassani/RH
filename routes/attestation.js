const express = require('express');
const router = express.Router();
const passport  = require('passport');
var mongoose = require('mongoose');
checkRoles = require('../middlewares/acl'); 

router.post('/create', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var attestation = new global.App.clientModel[(req.subdomains[1])].Attestation(req.body);
    attestation.save(function(err){
        if(err){
            res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
        }else{
            res.json({success:true, msg :"Demande créé avec succès"});
        } 
    });
});

router.put('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    
    global.App.clientModel[(req.subdomains[1])].Attestation.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if(err){
            res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
        }else{
            res.json({success:true, msg :"Demande créé avec succès"});
        } 
});
    });

router.get('/all', passport.authenticate('jwt', {session: false}), checkRoles(['rh','rhView']), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Attestation.find().sort('-createdAt').exec(function (err, attestations) {
          if (err) return next(err);
          res.json(attestations);
 });
      });

router.get('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['rh','rhView']), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Attestation.find({'user' : req.params.id}, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
    });
    
    router.get('/solde/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        var id = mongoose.Types.ObjectId(req.params.id);
        global.App.clientModel[(req.subdomains[1])].Attestation.aggregate([
            { $match: { 'user' : id, 'type.dure': { $ne: -1}  } },
            { $group: {
                _id: '$user',
                periode: { $sum: '$periode'}
            }}
            ]).exec(function(err, post) {
            if (err) return next(err);
            res.json(post);
        });
     });
    

router.get('/OneUserAttestation/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Attestation.find({"id" : req.params.id },{ _id: 1, attestation:1}).exec( function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

router.delete('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['rhDelete']), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Attestation.findByIdAndRemove(req.params.id, req.body, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

module.exports = router ;