const express = require('express');
const router = express.Router();
const passport  = require('passport');
var mongoose = require('mongoose');
checkRoles = require('../middlewares/acl'); 

router.post('/create', passport.authenticate('jwt', {session: false}), checkRoles(['dashboard']), function(req, res, next) {
    var convention = new global.App.clientModel[(req.subdomains[1])].Convention(req.body);
    convention.save(function(err){
        if(err){
            res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
        }else{
            res.json({success:true, msg :"Convention créé avec succès"});
        } 
    });
});

router.put('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['dashboard']), function(req, res, next) {
    
    global.App.clientModel[(req.subdomains[1])].Convention.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if(err){
            res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
        }else{
            res.json({success:true, msg :"Demande créé avec succès"});
        } 
});
    });

router.get('/all', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Convention.find().sort('-createdAt').exec(function (err, conventions) {
          if (err) return next(err);
          res.json(conventions);
 });
      });

router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Convention.find({'user' : req.params.id}, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
    });
    
    router.get('/solde/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        var id = mongoose.Types.ObjectId(req.params.id);
        global.App.clientModel[(req.subdomains[1])].Convention.aggregate([
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
    

router.get('/OneUserConvention/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Convention.find({"id" : req.params.id },{ _id: 1, convention:1}).exec( function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

router.delete('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['dashboard']), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Convention.findByIdAndRemove(req.params.id, req.body, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

module.exports = router ;