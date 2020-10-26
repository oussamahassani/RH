const express = require('express');
const router = express.Router();
const status = require('http-status');
const mongoose = require('mongoose');
const passport = require('passport');
checkRoles = require('../middlewares/acl'); 

    /* POST: save a new bill */
    router.post('/create', passport.authenticate('jwt', {session: false}), checkRoles(['billCreate']), function(req, res, next) {
      // create a new bill
      global.App.clientModel[(req.subdomains[1])].Bill.find().sort( { _id : -1 } ).limit(1).exec(function (err, bills) {
    if (err) return next(err);
    if(bills === undefined || bills.length == 0){
      var numero = 0;
    }else {
      var numero = bills[0].numero;
    }  
    console.log('1 '+numero);
      if(!numero || numero === 0 || numero ==='0'){
        numero ='000001'
      } else {
        // coerce the previous variable as a number and add 1
        tmp = Number(numero) + 1;
        // insert leading zeroes with a negative slice
        numero = ("000000" + tmp).slice(-6);
      }
      console.log(numero);  
      var newbill = new global.App.clientModel[(req.subdomains[1])].Bill();
      newbill.numero        = numero;
      newbill.amount        = req.body.amount;
      newbill.vat           = req.body.vat;
      newbill.paid_status   = req.body.paid_status;
      newbill.service     = req.body.service;
      newbill.creatorId     = req.body.creatorId;
      newbill.rs = req.body.rs;
      newbill.rsPercent = req.body.rsPercent ;
      newbill.debour = req.body.debour;
      newbill.debours = req.body.debours;
      newbill.type = req.body.type;
      newbill.timbre = req.body.timbre;
      if(req.body.payment)
      newbill.payment = req.body.payment;

      newbill.client        = req.body.client;
      newbill.sent          = req.body.sent;
      newbill.save(function(err,data){
          if(err){
              res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
          }else{
            var bill = {
              id: data.id,
              numero: numero
            }
              res.json({success:true, msg :"Facture créé avec succès", obj : bill});
          } 
        });
      });
});


    router.put('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['billUpdate']), function(req, res, next) {
      data = req.body;
      console.log (data);
      global.App.clientModel[(req.subdomains[1])].Bill.findByIdAndUpdate(req.params.id,{ $set:
          {
            numero        : data.numero,
            amount        : data.amount,
            tax           : data.tax,
            paid_status   : data.paid_status,
            services      : data.services,
            creatorId     : data.creatorId,
          }
       }, function (err, post) {
        if(err){
          res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
      }else{
          res.json({success:true, msg :"Mise à jour avec succès"});
      } 
        });
      });


      router.put('/updateBillPayment/:id',passport.authenticate('jwt', {session: false}), checkRoles(['billUpdate']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Bill.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
          if(err){
            res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
        }else{
            res.json({success:true, msg :"Mise à jour avec succès"});
        } 
          });
     });

        router.put('/UpdateBillStatus/:id',passport.authenticate('jwt', {session: false}), checkRoles(['billUpdate']), function(req, res, next) {
          const id = mongoose.Types.ObjectId(req.params.id);
        
          global.App.clientModel[(req.subdomains[1])].Bill.findByIdAndUpdate(req.params.id,{ $set:
            {
              paid_status   : true,
            }
         }, function (err, post) {
          if(err){
            res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
        }else{
            res.json({success:true, msg :"Mise à jour avec succès"});
        } 
        });
        });

        router.put('/UpdateBillsend/:id',passport.authenticate('jwt', {session: false}), checkRoles(['clients','billUpdate']), function(req, res, next) {
          const id = mongoose.Types.ObjectId(req.params.id);
        
          global.App.clientModel[(req.subdomains[1])].Bill.findByIdAndUpdate(req.params.id,{ $set:
            {
              sent   : true,
            }
         }, function (err, post) {
          if(err){
            res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
        }else{
            res.json({success:true, msg :"Note d'honoraires envoyer"});
        } 
        });
        });


        router.put('/updateDebour/:id',passport.authenticate('jwt', {session: false}), checkRoles(['billUpdate']), function(req, res, next) {
          const id = mongoose.Types.ObjectId(req.params.id);
          global.App.clientModel[(req.subdomains[1])].Bill.findByIdAndUpdate(id,{ $set:
            {
              debour   : req.body.debour,
              debours : req.body.debours,
            }
         }, function (err, post) {
          if(err){
            res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
        }else{
          res.json({success:true, msg :"Mise à jour avec succès"});
        } 
        });
        });

     router.get('/', passport.authenticate('jwt', {session: false}), checkRoles(['billView']), function(req, res, next) {
      global.App.clientModel[(req.subdomains[1])].Bill.find().sort('-updatedAt').exec(function (err, bills) {
          if (err) return next(err);
          res.json(bills);
        });
      });

      router.get('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['billView']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Bill.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
      router.delete('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['billDelete']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Bill.findByIdAndRemove(req.params.id, req.body, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });


      router.get('/getbills/:serviceIds',passport.authenticate('jwt', {session: false}), checkRoles(['bill','billView']), function(req, res, next) {
        console.log(req.params.serviceIds);
        var ids = req.params.serviceIds.toString().split(",");
        global.App.clientModel[(req.subdomains[1])].Bill.find({"_id" : {$in : ids} }).sort('-updatedAt').exec(function (err, bills) {
          if (err) return next(err);
          res.json(bills);
        });
      });
      
      router.get('/getbillsByclient/:ClientId',passport.authenticate('jwt', {session: false}), checkRoles(['clietsView','billView']), function(req, res, next) {
        console.log(req.params.ClientId);
        global.App.clientModel[(req.subdomains[1])].Bill.find({"client" : req.params.ClientId }).sort('-updatedAt').exec(function (err, bills) {
          if (err) return next(err);
          res.json(bills);
        });
      });

      router.get('/getbillForClient/:ClientId',passport.authenticate('jwt', {session: false}), function(req, res, next) {
        console.log(req.params.ClientId);
        global.App.clientModel[(req.subdomains[1])].Bill.find({$and : [ 
          {"client" : req.params.ClientId },
          {"sent": true}
      ],}).sort('-updatedAt').exec(function (err, bills) {
          if (err) return next(err);
          res.json(bills);
        });
      });

module.exports = router ;