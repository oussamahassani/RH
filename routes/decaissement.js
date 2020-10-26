const express = require('express');
const router = express.Router();
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const passport = require('passport');
checkRoles = require('../middlewares/acl'); 

    router.post('/create', passport.authenticate('jwt', {session: false}), checkRoles(['decaissementCreate']), function(req, res, next) {
        var decaissement = new global.App.clientModel[(req.subdomains[1])].Decaissement(req.body);
        decaissement.save(function(err){
            if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Achat créé avec succès"});
            } 
        });
    });


        router.put('/:id',passport.authenticate('jwt', {session: false}), checkRoles(['decaissementUpdate']), function(req, res, next) {
            global.App.clientModel[(req.subdomains[1])].Decaissement.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
              if(err){
                console.log(req.body);
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Achat créé avec succès"});
            } 
              });
         });
   

    
     router.get('/',passport.authenticate('jwt', {session: false}), checkRoles(['decaissementView']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Decaissement.find(function (err, decaissements) {
          if (err) return next(err);
          res.json(decaissements);
        });
      });



      router.get('/:id',passport.authenticate('jwt', {session: false}), checkRoles(['decaissement']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Decaissement.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
      router.delete('/:id',passport.authenticate('jwt', {session: false}), checkRoles(['decaissementDelete']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Decaissement.findByIdAndRemove(req.params.id, req.body, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

     
     



module.exports = router ;