const express = require('express');
const router = express.Router();
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const passport = require('passport');



    router.post('/create', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        var modaliteDepot = new global.App.clientModel[(req.subdomains[1])].ModaliteDepot();
        modaliteDepot.name = req.body.modName;
        modaliteDepot.save(function(err){
            if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Mode ajouter avec succès"});
            } 
        });
    });


        router.put('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
            global.App.clientModel[(req.subdomains[1])].ModaliteDepot.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
                if (err) return next(err);      
                res.json(post);
              });
         });
   

    
     router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].ModaliteDepot.find(function (err, modaliteDepots) {
          if (err) return next(err);
          res.json(modaliteDepots);
        });
      });

      router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].ModaliteDepot.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
      router.delete('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].ModaliteDepot.findByIdAndRemove(req.params.id, req.body, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

     
     



module.exports = router ;