const express = require('express');
const router = express.Router();
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const passport = require('passport');
checkRoles = require('../middlewares/acl'); 

    router.post('/create', passport.authenticate('jwt', {session: false}), checkRoles(['configCreate']), function(req, res, next) {
        var banque = new global.App.clientModel[(req.subdomains[1])].Banque(req.body);
        banque.save(function(err){
            if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Compte bancaire ajouté avec succès"});
            } 
        });
    });


        router.put('/:id',passport.authenticate('jwt', {session: false}), checkRoles(['configUpdate']), function(req, res, next) {
            global.App.clientModel[(req.subdomains[1])].Banque.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
              if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Achat créé avec succès"});
            } 
              });
         });
   

    
     router.get('/',passport.authenticate('jwt', {session: false}), checkRoles(['configView']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Banque.find(function (err, banques) {
          if (err) return next(err);
          res.json(banques);
        });
      });



      router.get('/:id',passport.authenticate('jwt', {session: false}), checkRoles(['config','configView']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Banque.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
      router.delete('/:id',passport.authenticate('jwt', {session: false}), checkRoles(['configDelete']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Banque.findByIdAndRemove(req.params.id, req.body, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

     
     



module.exports = router ;