const express = require('express');
const router = express.Router();
const status = require('http-status');
const mongoose = require('mongoose');
const passport = require('passport');

/* POST: save a new global.App.clientModel[(req.subdomains[1])].Notification */
router.post('/create', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  var data = req.body;
  // create a new global.App.clientModel[(req.subdomains[1])].Notification
  var newNotification = new global.App.clientModel[(req.subdomains[1])].Notification();
    newNotification.sender = data.sender;
    newNotification.receiver = data.receiver;
    newNotification.title = data.title;
    newNotification.image = data.image;
    newNotification.message = data.message;
    newNotification.link = data.link;
  // save the global.App.clientModel[(req.subdomains[1])].Notification
  newNotification.save(function(err, notification) {
    if(err){
        res.json({success:false, msg : err.errors[Object.keys(err.errors)[0]].message});
    }else{
        res.json({success:true, msg :"notification créé avec succès"});
        // sent notif to all users
        for (var i in newNotification.receiver)
        {
          req.app.io.emit(newNotification.receiver[i], 'notif for you !');
        }
    } 
  });
});


/* GET a global.App.clientModel[(req.subdomains[1])].Notification by receiver ID. */
router.get('/:NotificationId', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  var notificationId = req.params.NotificationId;

  // Check first if it is a valid Id
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    return res.status(400).send({
      message: 'global.App.clientModel[(req.subdomains[1])].Notification Id is invalid '+notificationId
    });
  }

  global.App.clientModel[(req.subdomains[1])].Notification.find({'receiver' : notificationId}).sort('-createdAt').limit(15).exec(function(err, notificationFounded) {
    if (err) return res.status(status.BAD_REQUEST).json(err);
    // We serve as json the Notifications founded
    res.status(status.OK).json(notificationFounded);
  });
});



/* GET all saved Notifications */
router.get('/', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    global.App.clientModel[(req.subdomains[1])].Notification.find({}, function(err, notifications) {
    if (err) return res.status(status.BAD_REQUEST).json(err);

    // object of all the Notifications
    res.status(status.OK).json(notifications);
  });
});

/* DELETE: delete a global.App.clientModel[(req.subdomains[1])].Notification by id */
router.delete('/Notification/:notificationId', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  var notificationId = req.params.notificationId;

  // find the notification by id and remove it
  global.App.clientModel[(req.subdomains[1])].Notification.findByIdAndRemove(notificationId, function(err) {
    if (err) return res.status(status.BAD_REQUEST).json(err);

    // The notification has been deleted
    res.status(status.OK).json({message: 'SUCCESS'});
  });
});


router.put('/seen/:userid', function(req, res, next) {
  const userid = mongoose.Types.ObjectId(req.params.userid);

  global.App.clientModel[(req.subdomains[1])].Notification.updateMany({'receiver' : userid, 'read_by.readerId': { $ne: userid} }, { 
    $push: {"read_by": {
      readerId:userid
}}}, function (err, post) {
  if (err) return next(err);      
  res.json(post);
});
});

module.exports = router;