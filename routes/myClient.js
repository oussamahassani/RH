const MyClientSchema = require('../models/myClients');
const services = require('../models/services');
const express = require('express');
const router = express.Router();
const passport  = require('passport') ; 
const jwt = require('jsonwebtoken') ;
const config = require('../config/database');
const bcrypt = require('bcrypt-nodejs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var crypto = require('crypto');


const conn = mongoose.createConnection(config.database, { useNewUrlParser: true,  useUnifiedTopology: false });
const MyClient = conn.model('myClients', MyClientSchema);
       /// groupe init 
       let groupe = {
      permissions:["appels","appelsCreate","appelsUpdate","appelsView","appelsDelete","encaissement","encaissementView","decaissement","decaissementFournisseur","decaissementCreate","decaissementUpdate","decaissementView","decaissementDelete","reglement","reglementtView","bill","billCreate","billUpdate","billView","billSend","users","usersCreate","usersUpdate","usersView","usersDelete","dashboard","dashboardCreate","dashboardUpdate","dashboardView","dashboardDelete","clients","clientsCreate","clientsUpdate","clientsView","clientsDelete","groupes","groupesCreate","groupesUpdate","groupesView","groupesDelete","rh","rhDemande","rhCreate","rhUpdate","rhView","rhDelete","config","configCreate","configUpdate","configView","configDelete"],
       groupename:"Admin"
      };

  function setPermissions(id){
      console.log(groupe);
      groupe.permissions.push(''+id);
      groupe.permissions.push(id+"Manager");
      groupe.permissions.push(id+'Create');
      groupe.permissions.push(id+'Update');
      groupe.permissions.push(id+'View');
      groupe.permissions.push(id+'Delete');
  }

    router.post('/register', function(req, res, next) {
      if(req.body.sub.toLowerCase() == "admin" || req.body.sub.toLowerCase() == "www"){
        res.json({success:false, msg : req.body.sub+" est réservé"});
        return;
      }
      var regex = /^[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]$/;
      if(!regex.test(req.body.sub) && req.body.sub.length < 2){
        res.json({success:false, msg : req.body.sub+" est invalide"});
        return;
      }
      console.log(req.body.number);
        var myClient = new MyClient();
        myClient.mat_fis       = req.body.mat_fis;
        myClient.size      = req.body.size;
        myClient.name      = req.body.company;
        myClient.fname     = req.body.fname;
        myClient.lname     = req.body.name;
        myClient.email     = req.body.email;
        var now = new Date().getFullYear();
        myClient.ref       = req.body.company + '-'+ now;
        let adress = req.body.adress;
        myClient.adress    = adress;
        myClient.tel    = req.body.number;
        myClient.active    = true;
        myClient.demo      = true;
        myClient.subdomain = req.body.sub.toLowerCase();
        myClient.dbUrl     = req.body.sub.toLowerCase();
        
        myClient.save(function(err,data){
            if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
                return;
            }else{
              const dbUrl = req.body.sub.toLowerCase().trim();
              var conn = mongoose.createConnection('mongodb+srv://devlopy:xdp.devlopy.db@xprtest-j2upz.mongodb.net/'+dbUrl+'?retryWrites=true&w=majority' , { useNewUrlParser: true,  useUnifiedTopology: false });
              console.dir('created_________________________ '+dbUrl);

      
           
           
              ///structure
            var configSchema = require('../models/configurations');
            const configModel = conn.model('configurations',configSchema);
            let structure = {
              name : req.body.company,
              email: req.body.email,
              mat_fis : req.body.mat_fis,
              image : 'xprgedDESC.png'
            }
            var structures = [];
            structures.push(structure);
            var postes = ['Assistant','Junior','Senior','Manager'];
            let x = {
              structure :structures,
              postes : postes
            }
            let configVariable = new configModel(x);

            configVariable.save(function(err,data){
              if(err){
                  res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
              }else{
                console.log('structure created');
              }
            });
            
              /// departs 
              var departs = [{name : 'Expertise comptable',services : ['Tenue comptable et fiscale','Paie & social']},
              {name : 'Audit',services : ['Audit contractuel','Audit fiscal','Audit juridique']},
              {name : 'Conseil',services : ['Conseil en gestion','Conseil fiscal','Conseil juridique']}];
              var ids ;
              var departSchema = require('../models/departements');
              const departModel = conn.model('departements',departSchema);
              let departVariable ;
               departs.forEach(departement => {
                
               departVariable = new departModel(departement);
               departVariable.save(function(err,data){
                if(err){
                    res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
                }else{      
                  console.log('depart created');       
                    setPermissions(data._id);
                    if(departs[departs.length - 1].name == departement.name){
   //// create 1st groupe admin
   var groupeSchema = require('../models/groupes');
   const groupeModel = conn.model('groupes',groupeSchema);
   var newGroupe = new groupeModel(groupe);
  
   newGroupe.save(function(err,data){
     if(err){
         res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
     }else{
       console.log('groupe created');
     }
   });
                    } 
                }      
              });
             });
  
          

              verificationSchema = require('../models/verifications');
              const subVerification = conn.model('verifications', verificationSchema);
              var verification = new subVerification({ _clientId: data._id, token: crypto.randomBytes(16).toString('hex') });
              verification.save(function(err,verificationData){
                if(err){
                    res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
                    return;
                }else{
          //prepare email body text
          var Body = "<html>";
          Body += "<b>Nom: </b>"+req.body.name+' ' + req.body.fname +" - ";
          Body += "<b>Email: </b>"+req.body.email+"<br/> <br/> ";
          Body += "<b>Numero de tel: </b>"+req.body.number+"<br/>";
          Body += "<b>Nombre de collaborateurs: </b>"+req.body.size+"<br/>";
          Body += "<b>Adresse: </b>"+req.body.adress+"<br/>";
          Body += "<b>Message: </b>"+req.body.message+"<br/>";
          Body += "</html>";
 
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'xprtunisie@gmail.com',
               pass: 'xpr.gmail147'
           }
       });
      var mailOptions = { from: 'contact@xpr.com.tn', to: 'admin@xpr.com.tn', subject: "Demande de dêmo from website", html: Body };
      transporter.sendMail(mailOptions, function (err) {
            //prepare email body text
            var Body = "<html>";
            Body += "<h1>L'equipe xpr vous remercie pour votre confiance</h1>"
            Body += "<a href='https://"+dbUrl+".xpr.com.tn/firstTime?token="+verificationData.token+"'>Cliquer ici </a>pour confirmer votre mail et accéder à votre plâtform";
            Body += "<br/><br/><br/><br/>";
            Body += "Si le button ne marche pas cliquer sur ce lien: https://"+dbUrl+".xpr.com.tn/firstTime?token="+verificationData.token+"<br/>";

            Body += "</html>";
                    
          if (err) { return res.status(500).send({ success:false, msg: err.message }); }
            var mailOptions = { 
                                headers: {
                                    "x-priority": "1",
                                    "x-msmail-priority": "High",
                                    importance: "high"
                                 },
                                from: 'contact@xpr.com.tn', 
                                to: req.body.email, 
                                subject: "XPR", html: Body };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ success:false, msg: err.message }); }
                res.json({success:true, msg :"Compte créé avec succès."});
              });
        });
      }
      });
      } 
        });
    });


    router.post('/reSend', function(req, res, next) {
      MyClient.find({email: req.body.email}, (err, client) =>{
        if(err) throw err ;
        if(!client){
            return res.json({success : false, msg : "L'email entré ne correspond à aucun compte"});
        }
        client = client[0];
        if(client.verified){
          return res.json({success : false, msg : "Votre compte est deja verifié!"});
        }
        var conn = mongoose.createConnection('mongodb+srv://devlopy:xdp.devlopy.db@xprtest-j2upz.mongodb.net/'+client.dbUrl+'?retryWrites=true&w=majority' , { useNewUrlParser: true,  useUnifiedTopology: false });
        verificationSchema = require('../models/verifications');
        const subVerification = conn.model('verifications', verificationSchema);
              var verification = new subVerification({ _clientId: client._id, token: crypto.randomBytes(16).toString('hex') });
              verification.save(function (err, verificationData) {
                  if (err) { return res.status(500).send({ success:false, msg: err.message }); }
                  // Send the email

                  var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                           user: 'xprtunisie@gmail.com',
                           pass: 'xpr.gmail147'
                       }
                   });
                  //prepare email body text
                  var Body = "<html>";
                  Body += "<h1>L'equipe xpr vous remercie pour votre confiance</h1>"
                  Body += "<a href='https://"+client.subdomain+".xpr.com.tn/firstTime?token="+verificationData.token+"'>Cliquer ici </a>pour confirmer votre mail et accéder à votre plâtform";
                  Body += "<br/><br/><br/><br/>";
                  Body += "Si le button ne marche pas cliquer sur ce lien: https://"+client.subdomain+".xpr.com.tn/firstTime?token="+verificationData.token+"<br/>";

                  Body += "</html>";
                   var mailOptions = { 
                    headers: {
                        "x-priority": "1",
                        "x-msmail-priority": "High",
                        importance: "high"
                     },
                    from: 'contact@xpr.com.tn', 
                    to: client.email, 
                    subject: "XPR", html: Body };
                    transporter.sendMail(mailOptions, function (err) {
                        if (err) { return res.status(500).send({ success:false, msg: err.message }); }
                        res.json({success:true, msg :"Un email de vérification a été envoyé à " + client.email + '.'});
                      });
            });
 
      });
    });

    router.put('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
          message: 'Id is invalid '+req.params.id
        });
      }
      if(req.body.password){
        bcrypt.hash(req.body.password, null , null , function(err,hash){
            if(err) return next(err);
              req.body.password = hash;
              MyClient.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
                if(err){
                  res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
                }else{
                    res.json({success:true, msg :"Mise à avec succès"});
                }
              });
    });  
}
else{
  MyClient.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    console.log(post); if(err){
      res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
      }else{
          res.json({success:true, msg :"Mise à avec succès"});
      }
  });
}
      });
   

    
     router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        MyClient.find(function (err, myClients) {
          if (err) return next(err);
          res.json(myClients);
        });
      });

      router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).send({
            message: 'Id is invalid '+req.params.id
          });
        }
        MyClient.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
      router.put('/delete/:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        services.distinct("myClient", function(error, myClient){
          if (error) return next(error);
          if(!myClient.includes(req.params.id.toString())){
            MyClient.findByIdAndUpdate(req.params.id, {active : false}, function (err, post) {
              if (err) return next(err);
              res.json("MyClient supprimé avec succès");
            });
          } else{
            res.json("Impossible de supprimer, le myClient a des services");
            }
        });
        
      });

     
     



module.exports = router ;