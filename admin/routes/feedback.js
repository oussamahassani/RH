const express = require('express');
const router = express.Router();
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const passport = require('passport');

const config = require('../config/database');
const mongoose = require('mongoose');
const FeedbackSchema = require('../../models/feedbacks');
const conn = mongoose.createConnection(config.database, { useNewUrlParser: true,  useUnifiedTopology: false });
const Feedback = conn.model('feedbacks', FeedbackSchema);


        router.put('/:id',passport.authenticate('admin', {session: false}), function(req, res, next) {
          Feedback.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
              if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Maj avec succès"});
            } 
              });
         });
   

    
     router.get('/',passport.authenticate('admin', {session: false}), function(req, res, next) {
      Feedback.find(function (err, feedbacks) {
          if (err) return next(err);
          res.json(feedbacks);
        });
      });
     
      router.get('/countall',passport.authenticate('admin', {session: false}), function(req, res, next) {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      Feedback.aggregate([
        { "$facet": {
          "all": [
            { "$match" : { }},
            { "$count": "all" },
          ],
          "thisMonth": [
            { "$match" : { createdAt: { $gt: firstDay }}},
            { "$count": "thisMonth" },
          ],
          "bugsthisMonth": [
            { "$match" : { createdAt: { $gt: firstDay }, type: 1}},
            { "$count": "bugsthisMonth" },
          ],
          "feedbacksthisMonth": [
            { "$match" : { createdAt: { $gt: firstDay }, type: 0}},
            { "$count": "feedbacksthisMonth" },
          ],
          "Bug": [
            { "$match" : {"type": 1}},
            { "$count": "Bug" }
          ],
          "Feedback": [
            { "$match" : {"type": 0}},
            { "$count": "Feedback" }
          ],
          "Waiting": [
            { "$match" : {"etat": 0}},
            { "$count": "Waiting" }
          ],
          "Resolue": [
            { "$match" : {"etat": 2}},
            { "$count": "Resolue" }
          ]
        }},
        { "$project": {
          "thisMonth": { "$arrayElemAt": ["$thisMonth.thisMonth", 0] },
          "Bug": { "$arrayElemAt": ["$Bug.Bug", 0] },
          "Feedback": { "$arrayElemAt": ["$Feedback.Feedback", 0] },
          "Waiting": { "$arrayElemAt": ["$Waiting.Waiting", 0] },
          "bugsthisMonth": { "$arrayElemAt": ["$bugsthisMonth.bugsthisMonth", 0] },
          "feedbacksthisMonth": { "$arrayElemAt": ["$feedbacksthisMonth.feedbacksthisMonth", 0] },
          "Resolue": { "$arrayElemAt": ["$Resolue.Resolue", 0] },
          "all": { "$arrayElemAt": ["$all.all", 0] }
        }}
      ]).exec(function (err, count) {
          if (err) return next(err);
          res.json(count);
        });
      });
      
      router.get('/countallThismonth',passport.authenticate('admin', {session: false}), function(req, res, next) {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      Feedback.count({ createdAt: { $gt: firstDay } },function (err, feedbacks) {
          if (err) return next(err);
          res.json(feedbacks);
        });
      });



      router.get('/:id',passport.authenticate('admin', {session: false}), function(req, res, next) {
        Feedback.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
      router.put('/delete/:id',passport.authenticate('admin', {session: false}), function(req, res, next) {
        Feedback.findByIdAndUpdate(req.params.id, {active : false}, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

     
     



module.exports = router ;