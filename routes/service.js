const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

    router.post('/create', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        var service = new global.App.clientModel[(req.subdomains[1])].Service();
        service.name = req.body.name;
        service.client = req.body.client;
        service.coutEstim = req.body.coutEstim;   
        service.coutFinal = req.body.coutFinal;  
        service.creatorId = req.body.creatorId;
        service.finish_date = req.body.finish_date;
        service.clientConsult = req.body.clientConsult ;
        service.clientDocs = req.body.clientDocs ;
        service.depart = req.body.depart;
        service.tasks = req.body.tasks ;
        if (req.body.montant){
          service.montant = '0.00';
        } else {
          service.montant = req.body.montant ;
          }
        service.save(function(err,data){
            if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message });
            }else{
                res.json({success:true, msg :"Service créé avec succès", obj : data.id});
            } 
        });
    });


        router.put('/updateService/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
          if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send({
              message: 'Id is invalid '+req.params.id
            });
          }
            global.App.clientModel[(req.subdomains[1])].Service.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
              console.log(req.body);
              if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message });
            }else{
                res.json({success:true, msg :"Service créé avec succès"});
            } 
              });
         });

         

        router.put('/addDoc/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
          if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send({
              message: 'Id is invalid '+req.params.id
            });
          }
          global.App.clientModel[(req.subdomains[1])].Service.findByIdAndUpdate(req.params.id,{ $set:
            {
              tasks: req.body.tasks
            }}, function (err, post) {
              if (err) return next(err);      
              res.json(post);
            });
       });

  
   

      router.get('/getYears/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
       let years = [];
        global.App.clientModel[(req.subdomains[1])].Service.findOne({}, {}, { sort: { 'createdAt' : 1 } }, function(err, post) {
          if(post)
          years.push(post.createdAt);
          if (err) return next(err);      
          global.App.clientModel[(req.subdomains[1])].Service.findOne({}, {}, { sort: { 'createdAt' : -1 } }, function(err, post) {
            if(post)
            years.push(post.createdAt);
            if (err) return next(err);      
            res.json(years);
          });
        
        });

      });

      router.get('/getServicesByYear/:year', passport.authenticate('jwt', {session: false}), function(req, res, next) {
       let year = new Date()
       year.setDate(1);
       year.setMonth(0);
       year.setFullYear(req.params.year);

       let lyear = new Date()
       lyear.setDate(31);
       lyear.setMonth(11);
       lyear.setFullYear(req.params.year);
       console.log(year);
       console.log(lyear);
        global.App.clientModel[(req.subdomains[1])].Service.find({ createdAt: { $gte: year , $lte : lyear} },function (err, services) {
          if (err) return next(err);
          res.json(services);
          
        });
 
       });


    
     router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Service.find(function (err, services) {
          if (err) return next(err);
          res.json(services);
        }).sort( { createdAt: -1 } );
      });

      router.get('/getbyId/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).send({
            message: 'Id is invalid '+req.params.id
          });
        }
        global.App.clientModel[(req.subdomains[1])].Service.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

      router.get('/getServicesByIds/:ids', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        console.log(req.params.ids);
        ids = req.params.ids.split(',');
        for (let id of ids) {
          if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({
              message: 'Id is invalid '+ id
            });
          }
        }
        console.log(ids);
        global.App.clientModel[(req.subdomains[1])].Service.find({
          '_id': { $in: ids}
      }, function (err, post) {
        if (err) return next(err);
        res.json(post);
      });
    });

    router.get('/getServicesByClientId/:ClientId', function(req, res, next) {
        console.log(req.params.ClientId);
        global.App.clientModel[(req.subdomains[1])].Service.find({"client" : req.params.ClientId }).sort('-updatedAt').exec(function (err, bills) {
          if (err) return next(err);
          res.json(bills);
        });
      });

    router.get('/getServicesForbillByIds/:ids', passport.authenticate('jwt', {session: false}), function(req, res, next) {
      console.log(req.params.ids);
      ids = req.params.ids.split(',');
      for (let id of ids) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).send({
            message: 'Id is invalid '+ id
          });
        }
      }
      console.log(ids);
      global.App.clientModel[(req.subdomains[1])].Service.find({
        '_id': { $in: ids}
    }, { name: 1, montant: 1 }, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  });

      router.delete('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Service.findByIdAndRemove(req.params.id, req.body, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
     
        router.put('/updateMontant/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
          if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).send({
              message: 'Id is invalid '+req.params.id
            });
          }
          global.App.clientModel[(req.subdomains[1])].Service.findByIdAndUpdate(req.params.id,{ $set:
            {
              montant: req.body.montant
            }}, function (err, post) {
            if(err){
              res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Mise à jour avec succès"});
            } 
            });
       });

       router.put('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).send({
            message: 'Id is invalid '+req.params.id
          });
        }
        groupe.findByIdAndUpdate(req.params.id,{ $set:
          {
            montant: req.body.montant,
            permissions: permission
          }
       }, function (err, post) {
        if(err){
          res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
      }else{
          res.json({success:true, msg :"Mise à jour avec succès"});
      } 
        });
      });


      
      
      router.put('/UpdateBilledStatus/:ids', function(req, res, next) {
        let ids = req.params.ids.split(",").map(s => mongoose.Types.ObjectId(s));
        console.log(ids);
        global.App.clientModel[(req.subdomains[1])].Service.updateMany(
          { _id: { $in: ids } },
          { $set: { billed : true } }, function (err, post) {
            if(err){
              res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
          }else{
              res.json({success:true, msg :"Mise à jour avec succès"});
          } 
      });
     });


module.exports = router ;