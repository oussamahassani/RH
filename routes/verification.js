const express = require('express');
const router = express.Router();
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('../config/database');
      router.get('/:id', function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Verification.findOne({ token: req.params.id }, function (err, ver) {
          if (err) return next(err);
          
            const MyClientSchema = require('../models/myClients');
            const conn = mongoose.createConnection(config.database, { useNewUrlParser: true,  useUnifiedTopology: false });
            const MyClient = conn.model('myClients', MyClientSchema);
            MyClient.findOne({subdomain:req.subdomains[1]}, function (err, client) {
                if (err) return next(err);
                if(ver){
                  res.json({exist:true, client : client});
                  }else{
                    res.json({exist:false , email:client.email});
                  }
            });
        });
      });
     
     



module.exports = router ;