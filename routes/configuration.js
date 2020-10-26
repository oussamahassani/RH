const express = require('express');
const router = express.Router();
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const passport = require('passport');
checkRoles = require('../middlewares/acl'); 

    router.post('/create', passport.authenticate('jwt', {session: false}), checkRoles(['configCreate']), function(req, res, next) {
        var configuration = new global.App.clientModel[(req.subdomains[1])].Configuration(req.body);
        configuration.save(function(err){
            if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Configuration créé avec succès"});
            } 
        });
    });

    router.put('/addStruct:id',passport.authenticate('jwt', {session: false}), checkRoles(['configCreate']), function(req, res, next) {
      global.App.clientModel[(req.subdomains[1])].Configuration.findByIdAndUpdate(req.params.id, { $push: { 'structure': req.body } }, function (err, post) {
        if(err){
          res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
      }else{
          res.json({success:true, msg :"Ajout avec succès"});
      } 
        });
   });
   
   router.put('/:id',passport.authenticate('jwt', {session: false}), checkRoles(['configView','config','configCreate']), function(req, res, next) {
     console.log(req.body);
     delete req.body.postes;
     delete req.body.poste;
      global.App.clientModel[(req.subdomains[1])].Configuration.update({
        _id : req.params.id, "structure._id" :  req.body.structId
      }, 
         { "$set": { "structure.$": req.body } }, function (err, post) {
           console.log(err);
        if(err){
          res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
      }else{
          res.json({success:true, msg :"Maj avec succès"});
      } 
        });
   });

    
     router.get('/',passport.authenticate('jwt', {session: false}), checkRoles(['config','configView']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Configuration.find(function (err, configurations){
          if (err) return next(err);
          res.json(configurations);
        }).limit(1);
      });
     
      router.get('/postes',passport.authenticate('jwt', {session: false}), checkRoles(['configCreate','configUpdate']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Configuration.findOne({}, {postes:1, _id:0}).limit(1).exec(function (err, postes){
          if (err) return next(err);
          res.json(postes);
        });
      });



      router.get('/:id',passport.authenticate('jwt', {session: false}), checkRoles(['config']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Configuration.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
      router.put('/delete/:id',passport.authenticate('jwt', {session: false}), checkRoles(['configDelete']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Configuration.findByIdAndUpdate(req.params.id, {active : false}, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

     
     



module.exports = router ;