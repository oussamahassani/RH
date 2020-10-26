const MyClientSchema = require('../../models/myClients');
const express = require('express');
const router = express.Router();
const passport  = require('passport'); 
const config = require('../config/database');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoose = require('mongoose');

const conn = mongoose.createConnection(config.database, { useNewUrlParser: true,  useUnifiedTopology: false });
const MyClient = conn.model('myClients', MyClientSchema);

     router.get('/', passport.authenticate('admin', {session: false}), function(req, res, next) {
        MyClient.find().sort( { _id: -1 } ).exec(function (err, myClients) {
          if (err) return next(err);
          res.json(myClients);
        });
      });

     



module.exports = router ;