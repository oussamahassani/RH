const express = require('express');
const router = express.Router();
const passport  = require('passport');
var mongoose = require('mongoose');

router.post('/create', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var conge = new global.App.clientModel[(req.subdomains[1])].Conge(req.body);
    conge.save(function(err){
        if(err){
            res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
        }else{
            res.json({success:true, msg :"Demande créé avec succès"});
        } 
    });
});

router.put('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['rh']), function(req, res, next) {
    
    global.App.clientModel[(req.subdomains[1])].Conge.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);      
    res.json(post);
});
    });

router.get('/all', passport.authenticate('jwt', {session: false}), checkRoles(['rhView']), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Conge.find().sort('-createdAt').exec(function (err, conges) {
          if (err) return next(err);
          res.json(conges);
 });
      });

router.get('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['rh']), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Conge.find({'user' : req.params.id}, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
    });
    
    router.get('/solde/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        var id = mongoose.Types.ObjectId(req.params.id);
        global.App.clientModel[(req.subdomains[1])].Conge.aggregate([
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
    

router.get('/OneUserConge/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Conge.find({"id" : req.params.id },{ _id: 1, conge:1}).exec( function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

router.delete('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['configDelete']), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Conge.findByIdAndRemove(req.params.id, req.body, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

module.exports = router ;