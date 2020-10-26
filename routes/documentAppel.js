const express = require('express');
const router = express.Router();
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const passport = require('passport');



    router.post('/create', passport.authenticate('jwt', {session: false}), function(req, res, next) {
      req.body.path.forEach(path => {
        var documentAppel = new global.App.clientModel[(req.subdomains[1])].Appelsdocument();
        documentAppel.path = path;
        documentAppel.category = req.body.category;
        documentAppel.isRef = req.body.isRef;
        documentAppel.save(function(err){
          if (err){
            res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            return next(err);
          }   
        });
      });
              res.json({success:true, msg :"Document ajouter avec succès"});
    });


        router.put('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
            global.App.clientModel[(req.subdomains[1])].Appelsdocument.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
                if (err) return next(err);      
                res.json(post);
              });
         });
   

    
     router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Appelsdocument.find(function (err, documentAppels) {
          if (err) return next(err);
          res.json(documentAppels);
        });
      });

      router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Appelsdocument.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
      router.delete('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Appelsdocument.findByIdAndRemove(req.params.id, req.body, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

     
     



module.exports = router ;