const groupe = require('../models/groupes');
const express = require('express');
const router = express.Router();
const passport  = require('passport');
checkRoles = require('../middlewares/acl'); 

    router.post('/create', passport.authenticate('jwt', {session: false}), checkRoles(['appelsCreate']), function(req, res, next) {
        
        var appeldoffre = new global.App.clientModel[(req.subdomains[1])].Appelsdoffre();
        appeldoffre.ste   = req.body.ste;
        appeldoffre.reference   = req.body.ref;
        appeldoffre.titre       = req.body.title;
        appeldoffre.category    = req.body.category;
        appeldoffre.commentaire = req.body.commentaire;
        appeldoffre.users       = req.body.users;
        appeldoffre.files       = req.body.files;

        appeldoffre.save(function(err,data){
            if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Appel d'offre ajouter avec succès", obj : data.id});
            } 
        });
    });


    router.put('/update/:id', passport.authenticate('jwt', {session: false}), checkRoles(['usersUpdate']), function(req, res, next) {
      global.App.clientModel[(req.subdomains[1])].Appelsdoffre.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if(err){
          res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
      }else{
          res.json({success:true, msg :"Mise à jour avec succès"});
      } 
        });
      });

      
     router.put('/updateFiles/:id', passport.authenticate('jwt', {session: false}), checkRoles(['appelsUpdate']), function(req, res, next) {
      global.App.clientModel[(req.subdomains[1])].Appelsdoffre.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if(err){
          res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
      }else{
          res.json({success:true, msg :"Mise à jour avec succès"});
      } 
        });
      });

      router.put('/addFiles/:id', passport.authenticate('jwt', {session: false}), checkRoles(['appelsUpdate','appelsCreate']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Appelsdoffre.update({ _id: req.params.id },
           { $push: { filesCreated : { $each: req.body.filesCreated }}}, function (err, post) {
          if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Mise à jour avec succès"});
            } 
          });
        });

     router.get('/', passport.authenticate('jwt', {session: false}), checkRoles(['appelsView']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Appelsdoffre.find().sort('-createdAt').exec(function (err, appeldoffres) {
          if (err) return next(err);
          res.json(appeldoffres);
        });
      });

      router.get('/refs', passport.authenticate('jwt', {session: false}), checkRoles(['appelsCreate','appelsUpdate']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Appelsdoffre.aggregate(
          [
          {"$group": { "_id": { ste: "$ste", ref: "$reference" } } }
          ]).exec(function (err, refs) {
          if (err) return next(err);
          res.json(refs);
        });
      });

   

      router.get('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['appels']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Appelsdoffre.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
      router.delete('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['appelsDelete']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Appelsdoffre.findByIdAndRemove(req.params.id, req.body, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

     
     



module.exports = router ;