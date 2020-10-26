const express = require('express');
const router = express.Router();
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const passport = require('passport');

    router.post('/create', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        var service = new global.App.clientModel[(req.subdomains[1])].ModelService();
        service.serviceName    = req.body.modelName;
        service.departement = req.body.depart;
        if(req.body.tasks !== null && req.body.tasks !=='') {
          service.tasks = [];
          req.body.tasks.forEach(element => {
            service.tasks.push(element);
          });
        }
       console.log(service);
        // console.log(Object.prototype.toString.call(req.body.tasks) == '[object Array]');
        // console.log(Array.isArray(service.tasks));

        service.save(function(err){
            if(err){
                res.json({success:false, msg : err});
            }else{
                res.json({success:true, msg :"Modele service créé avec succès"});
            } 
        });
    });


        router.put('/:id',passport.authenticate('jwt', {session: false}), function(req, res, next) {
            global.App.clientModel[(req.subdomains[1])].ModelService.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
                if (err) return next(err);      
                res.json(post);
              });
         });
   

    
     router.get('/',passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].ModelService.find(function (err, services) {
          if (err) return next(err);
          res.json(services);
        });
      });

      router.put('/editByName/:serviceName',passport.authenticate('jwt', {session: false}), function(req, res, next) {
          global.App.clientModel[(req.subdomains[1])].ModelService.findOneAndUpdate({"serviceName": req.body.serviceName}, req.body, function (err, post) {
            if(err){
              res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
          }else{
              res.json({success:true, msg :"Modele service créé avec succès"});
          } 
        });
      });

      router.get('/:id',passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].ModelService.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
      router.delete('/:id',passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].ModelService.findByIdAndRemove(req.params.id, req.body, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

     
     



module.exports = router ;