const express = require('express');
const router = express.Router();
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const passport = require('passport');
const config = require('../config/database');

const mongoose = require('mongoose');
const FeedbackSchema = require('../models/feedbacks');
const conn = mongoose.createConnection(config.database, { useNewUrlParser: true,  useUnifiedTopology: false });
const Feedback = conn.model('feedbacks', FeedbackSchema);


    router.post('/create', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        var feedback = Feedback(req.body);
        feedback.subdomain = req.subdomains[1];
        feedback.save(function(err){
            if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Feedback créé avec succès"});
            } 
        });
    });


        router.put('/:id',passport.authenticate('jwt', {session: false}), function(req, res, next) {
          Feedback.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
              if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Maj avec succès"});
            } 
              });
         });
   

    
     router.get('/',passport.authenticate('jwt', {session: false}), function(req, res, next) {
      Feedback.find({subdomain: req.subdomains[1]},function (err, feedbacks) {
          if (err) return next(err);
          res.json(feedbacks);
        });
      });



      router.get('/:id',passport.authenticate('jwt', {session: false}), function(req, res, next) {
        Feedback.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
      router.put('/delete/:id',passport.authenticate('jwt', {session: false}), function(req, res, next) {
        Feedback.findByIdAndUpdate(req.params.id, {active : false}, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

     
     



module.exports = router ;