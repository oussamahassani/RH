const express = require('express');
const router = express.Router();
const passport  = require('passport') ; 
const mongoose = require('mongoose');
var Facture = require('../../admin/models/factures');
var conn = mongoose.createConnection('mongodb+srv://devlopy:xdp.devlopy.db@xprtest-j2upz.mongodb.net/ADMINXPR?retryWrites=true&w=majority' , { useNewUrlParser: true,  useUnifiedTopology: false });
const factureModel = conn.model('Facture',Facture);

router.post('/create', function(req, res, next) {
facture = new factureModel(req.body);      
        facture.save(function(err,data){
            if(err){
                console.log("aaa");
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
              console.log("done");
                res.json({success:true, msg :"facture créé avec succès", data : data});
            } 
        });
    });


    router.put('/:id', function(req, res, next) {
      console.log("bbb");
      factureModel.findByIdAndUpdate(req.params._id, req.body, function (err, post) {
          if(err){
              res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Mise à jour aves succès"});
            } 
        });
    });

   

     router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
       Facture.find(function (err, adminUsers) {
          if (err) return next(err);
          res.json(adminUsers);
        });
      });

   

      router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Facture.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
module.exports = router ;