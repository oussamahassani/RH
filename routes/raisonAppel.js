const express = require('express');
const router = express.Router();
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const passport = require('passport');



    router.post('/create', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        var raisonAppel = new global.App.clientModel[(req.subdomains[1])].RaisonAppel();
        raisonAppel.name = req.body.name;
        raisonAppel.save(function(err){
            if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Raison ajouter avec succès"});
            } 
        });
    });


        router.put('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
            global.App.clientModel[(req.subdomains[1])].RaisonAppel.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
                if (err) return next(err);      
                res.json(post);
              });
         });
   

    
     router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].RaisonAppel.find(function (err, raisonAppel) {
          if (err) return next(err);
          res.json(raisonAppel);
        });
      });

      router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].RaisonAppel.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
      router.delete('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].RaisonAppel.findByIdAndRemove(req.params.id, req.body, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

     
     



module.exports = router ;