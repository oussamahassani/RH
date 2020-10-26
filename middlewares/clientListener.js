const mongoose = require('mongoose');
var config = require('../config/database');
const conn = mongoose.createConnection(config.database, { useNewUrlParser: true,  useUnifiedTopology: false });
MyClientSchema = require('../models/myClients');
const Clients = conn.model('myClients', MyClientSchema);
var basedomain = config.baseDomain;
var allowedSubs = {'admin': true, 'www': true};
allowedSubs[basedomain] = true;

//console.dir(allowedSubs);

function clientlistener() {
    return function (req, res, next) {
            //console.dir(JSON.stringify(req.session) + ' here');
        //check if client has already been recognized
        if (req.subdomains[1] in allowedSubs || typeof req.subdomains[1] == 'undefined' || req.session.Client && req.session.Client.name === req.subdomains[1]) {
            console.log('did not search database for ' + req.subdomains[1]);
            if(req.subdomains[1] == 'admin'){
                req.session.Client = {
                    name : "admin",
                    subdomain : "admin",
                    dbUrl : "ADMINXPR"
                };
            }
            //console.log(JSON.stringify(req.session.Client, null, 4));
            return next();
        }

        //look for client in database
        else {

            Clients.findOne({subdomain: req.subdomains[1]}, function (err, client) {
                if (!err) {
                    //if client not found
                    if (!client) {                       
                       if(req.hostname){
                           var hostname = req.get('host');
                            var fullUrl = req.protocol + '://' + hostname.substring(hostname.indexOf(".") + 1);
                            console.log(JSON.stringify(req.subdomains));
                            res.redirect(fullUrl+'/NotFound');
                        } else
                            res.status(403).send('Sorry! you cant see that.');
                        //console.log(client);
                    }
                    // client found, create session and add client
                    else {
                        console.log('searched database for ' + req.subdomains[1]);
                        req.session.Client = {
                            name : client.name,
                            subdomain : client.subdomain,
                            dbUrl : client.dbUrl
                        };
                        console.log(req.session.Client);
                        return next();
                    }
                }
                else {
                    console.log(err);
                    return next(err)
                }

            });
        }

    }
}

module.exports = clientlistener;