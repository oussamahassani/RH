const express = require('express');
const router = express.Router();
const passport  = require('passport') ; 
const jwt = require('jsonwebtoken') ;
const config = require('../config/database');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
checkRoles = require('../middlewares/acl'); 

    router.post('/register', passport.authenticate('jwt', {session: false}), checkRoles(['clientsCreate']), function(req, res, next) {
        var client = new global.App.clientModel[(req.subdomains[1])].Client();
        console.log(req.body.pm);
        client.pm = req.body.pm;
        client.mat_fis = req.body.mat_fis;
        if(req.body.pm) {
          client.name    = req.body.name;
        } else {
          client.fname    = req.body.fname;
          client.lname    = req.body.lname;
        }

        if(req.body.porteur){
        	client.porteur = req.body.porteur;   
        }
        client.email    = req.body.email;
        client.ref    = req.body.ref;
        client.adress = req.body.adress;
        client.rib = req.body.rib;
        client.bank = req.body.bank;
        client.password = req.body.password;
        client.tel = req.body.tel;
        client.structure = req.body.structure;
        if(req.body.fax !=='' || req.body.fax == null)
          client.fax = req.body.fax;
        client.save(function(err,data){
            if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Client créé avec succès", obj : data.id});
            } 
        });
    });


  

    router.post('/auth', function(req, res, next) {
      const email = req.body.email ;
      const password = req.body.password ;
      global.App.clientModel[(req.subdomains[1])].Client.findOne({email:email}, (err, client) =>{
        if(err) throw err ;
          if(!client){
              return res.json({success : false, msg : "L ' email entré ne correspond à aucun compte"});
          }
          bcrypt.compare(password,client.password, (err, isMatch) => {
            if(err) throw err ;
          if(isMatch){
            let clientToken = new global.App.clientModel[(req.subdomains[1])].Client();
            clientToken = client;
            clientToken.subdomain = req.subdomains[1];
            let finalToken = clientToken.toJSON()
            finalToken.isClient = true;
            finalToken.subdomain = req.subdomains[1];
            delete finalToken.password;
            const token = jwt.sign(finalToken, config.secret, {
                  expiresIn: 28800 
              });
              res.json({
                  success : true,
                  token : 'XPRS '+token
              })
          }
          else{
              return res.json({success : false, msg : "Mot de passe incorrect"}); 
          }
          });

          
      });
   });



    router.put('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['clientsUpdate']), function(req, res, next) {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
          message: 'Id is invalid '+req.params.id
        });
      }
      if(!req.body.fax || req.body.fax.length<2){
        delete req.body.fax;
      }
      if(req.body.password){
        bcrypt.hash(req.body.password, null , null , function(err,hash){
            if(err) return next(err);
              req.body.password = hash;
              global.App.clientModel[(req.subdomains[1])].Client.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
                if(err){
                  res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
                }else{
                    res.json({success:true, msg :"Mise à avec succès"});
                }
              });
    });  
}
else{
  global.App.clientModel[(req.subdomains[1])].Client.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    console.log(post); if(err){
      res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
      }else{
          res.json({success:true, msg :"Mise à avec succès"});
      }
  });
}
      });
   

    
     router.get('/', passport.authenticate('jwt', {session: false}), checkRoles(['clients','clientsView']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Client.find(function (err, clients) {
          if (err) return next(err);
          res.json(clients);
        });
      });

      router.get('/:id', passport.authenticate('jwt', {session: false}), checkRoles(['clients']), function(req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).send({
            message: 'Id is invalid '+req.params.id
          });
        }
        global.App.clientModel[(req.subdomains[1])].Client.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
      router.put('/delete/:id', passport.authenticate('jwt', {session: false}), checkRoles(['clientsDelete']), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].services.distinct("client", function(error, client){
          if (error) return next(error);
          if(!client.includes(req.params.id.toString())){
            global.App.clientModel[(req.subdomains[1])].Client.findByIdAndUpdate(req.params.id, {active : false}, function (err, post) {
              if (err) return next(err);
              res.json(".Client supprimé avec succès");
            });
          } else{
            res.json("Impossible de supprimer, le client a des services");
            }
        });
        
      });

     
     



module.exports = router;