var CronJob = require('cron').CronJob;
const mongoose = require('mongoose');
const MyClientSchema = require('../../models/myClients');
const ServicesSchema = require('../../models/services');
const NotifSchema = require('../../models/notifications');
const config = require('../config/database');

module.exports = function(app) {
    var i =1;
var job = new CronJob('45,45 9,16 * * *', function() {
    console.log('fcyygh');
    var todayDate = new Date();
    var todayIsoDate = todayDate.toISOString();
    todayDate.setDate(todayDate.getDate()-7);
    var lastweek = todayDate.toISOString();

    const conn = mongoose.createConnection(config.database, { useNewUrlParser: true,  useUnifiedTopology: false });
    const MyClient = conn.model('myClients', MyClientSchema);
    MyClient.find({"active":true, verified:true},{"dbUrl":1, "_id":0},function (err, myClients) {
        if (err) return next(err);
        myClients.forEach(myClient => {
            var thisConn = mongoose.createConnection(config.databasef+myClient.dbUrl+'?retryWrites=true&w=majority', { useNewUrlParser: true,  useUnifiedTopology: false });
            var thisServices = thisConn.model('services', ServicesSchema);
            var thisNotif = thisConn.model('notifications', NotifSchema);
            thisServices.find({
                tasks: 
                {$elemMatch: 
                    {
                     finish_date:'En cours',
                     date_fin:{ $lt: todayIsoDate}
                    }
                }},{"name":1, "_id":1,"tasks":1},function (err, services) {
                if (err) return next(err);
                console.dir(myClient.dbUrl); 
                services.forEach(service => {
                    service.tasks.forEach(task => {
                        var endDate = new Date(task.date_fin).toISOString();
                        if(task.finish_date == 'En cours' && endDate < todayIsoDate && endDate > lastweek){
                            console.log(''+service.name+' /'+task.user);
                            var newNotification = new thisNotif();
                                newNotification.sender = '000000000000000000000000';
                                var receiver = task.helpers;
                                receiver.push(task.user);
                                newNotification.receiver = receiver;
                                newNotification.title = 'Rappel';
                                newNotification.message = 'Vous avez une tâche en retard dans \"'+service.name+'\"';
                                newNotification.link = {
                                    url:"/tasks",
                                    params:"id",
                                    paramsValue:service._id
                                };
                            newNotification.save(function(err, notification) {
                                if(err){
                                    return;
                                }else{for (var i in newNotification.receiver)
                                    {
                                    app.io.emit(newNotification.receiver[i], 'notif for you !');
                                    }
                                } 
                            });       
                        }             
                    });                    
                });
            });
        });
    });

}, null, true, 'Africa/Tunis');
job.start();
   
}