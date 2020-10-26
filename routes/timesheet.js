const express = require('express');
const router = express.Router();
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const passport = require('passport');

    router.post('/create', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        var timesheet = new global.App.clientModel[(req.subdomains[1])].Timesheet(req.body);
        timesheet.save(function(err){
            if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"global.App.clientModel[(req.subdomains[1])].Timesheet créé avec succès"});
            } 
        });
    });


        router.put('/:id',passport.authenticate('jwt', {session: false}), function(req, res, next) {
            global.App.clientModel[(req.subdomains[1])].Timesheet.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
              if(err){
                res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
            }else{
                res.json({success:true, msg :"Maj avec succès"});
            } 
              });
         });
   

    
     router.get('/',passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Timesheet.find(function (err, Timesheets) {
          if (err) return next(err);
          res.json(global.App.clientModel[(req.subdomains[1])].Timesheets);
        });
      });

      router.get('/getTimesheetsByYear/:year/:user', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        let year = new Date()
        year.setDate(1);
        year.setMonth(0);
        year.setFullYear(req.params.year);
        let lyear = new Date()
        lyear.setDate(31);
        lyear.setMonth(11);
        lyear.setFullYear(req.params.year);
         global.App.clientModel[(req.subdomains[1])].Timesheet.find({ createdAt: { $gte: year , $lte : lyear} , user : req.params.user},function (err, timesheets) {
           if (err) return next(err);
           res.json(timesheets);
           
         });
  
        });


        
      router.get('/getTimesheetsByMonth/:year/:user/:month', passport.authenticate('jwt', {session: false}), function(req, res, next) {
        console.log(req.params.month);
        console.log(req.params.user); 
        console.log(req.params.year); 

        global.App.clientModel[(req.subdomains[1])].Timesheet.find({ year : req.params.year,month :req.params.month , user : req.params.user},function (err, timesheets) {
           if (err) return next(err);
           res.json(timesheets);
           console.log(timesheets);
           
         });
  
        });


      router.get('/:id',passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Timesheet.findById(req.params.id, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });
      
      router.put('/delete/:id',passport.authenticate('jwt', {session: false}), function(req, res, next) {
        global.App.clientModel[(req.subdomains[1])].Timesheet.findByIdAndUpdate(req.params.id, {active : false}, function (err, post) {
          if (err) return next(err);
          res.json(post);
        });
      });

     
     



module.exports = router ;