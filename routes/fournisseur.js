const express = require('express');
const router = express.Router();
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const passport = require('passport');

    router.post('/create', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        var fournisseur = new global.App.clientModel[(req.subdomains[1])].Fournisseur(req.body);
        fournisseur.save(function(err){
            if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"global.App.clientModel[(req.subdomains[1])].Fournisseur créé avec succès"});
            } 
        });
    });


        router.put('/:id',passport.authenticate('jwt', {session: false}), function(req, res, next) {
            global.App.clientModel[(req.subdomains[1])].Fournisseur.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
              if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Maj avec succès"});
            } 
              });
         });
   

    
     router.get('/',passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Fournisseur.find(function (err, fournisseurs) {
          if (err) return next(err);
          res.json(fournisseurs);
        });
      });



      router.get('/:id',passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Fournisseur.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
      router.put('/delete/:id',passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Fournisseur.findByIdAndUpdate(req.params.id, {active : false}, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

     
     



module.exports = router ;