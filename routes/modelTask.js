const express = require('express');
const router = express.Router();
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const passport = require('passport');



    router.post('/create', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        var task = new global.App.clientModel[(req.subdomains[1])].ModelTask();
        task.departement    = req.body.depart;
        task.task    = req.body.task;
        task.time = req.body.time ;
        task.repeat = req.body.repeat ;
        task.save(function(err){
            if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Tâche créé avec succès"});
            } 
        });
    });


        router.put('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
            global.App.clientModel[(req.subdomains[1])].ModelTask.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
              if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
               }else{
                res.json({success:true, msg :"Tâche créé avec succès"});
               } 
              });
         });
   

    
     router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].ModelTask.find(function (err, tasks) {
          if (err) return next(err);
          res.json(tasks);
        });
      });

      router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].ModelTask.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
      router.delete('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].ModelTask.findByIdAndRemove(req.params.id, req.body, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

     
     



module.exports = router ;