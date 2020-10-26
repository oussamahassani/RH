const express = require('express');
const router = express.Router();
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const passport = require('passport');
checkRoles = require('../middlewares/acl'); 



    router.post('/create', passport.authenticate('jwt', {session: false}), checkRoles(['appels','appelsCreate']), function(req, res, next) {
        var categoryAppel = new global.App.clientModel[(req.subdomains[1])].CategoryAppel();
        categoryAppel.name = req.body.catName;
        categoryAppel.save(function(err){
            if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Categorie ajouter avec succès"});
            } 
        });
    });


        router.put('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['appels','appelsUpdate']), function(req, res, next) {
            global.App.clientModel[(req.subdomains[1])].CategoryAppel.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
                if (err) return next(err);      
                res.json(post);
              });
         });
   

    
     router.get('/', passport.authenticate('jwt', {session: false}), checkRoles(['appels','appelsView']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].CategoryAppel.find(function (err, categoryAppels) {
          if (err) return next(err);
          res.json(categoryAppels);
        });
      });

      router.get('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['appels','appelsView']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].CategoryAppel.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
      router.delete('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['appelsDelete']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].CategoryAppel.findByIdAndRemove(req.params.id, req.body, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

     
     



module.exports = router ;