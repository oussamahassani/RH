'use strict';
/**
 * Created by moyofalaye on 3/17/14.
 */

var path = require('path');
var config = require('../config/config');
var glob = require('glob');

glob("../models/*.js",{"ignore":['index.html']}, function (err, files) {
    files.forEach(file => {
    require(path.resolve(file));
    console.log(file); 
    });
  })



function modelsInit() {
    return function (req, res, next) {

        switch (req.subdomains[1]) {
            case 'www':
            case undefined:
                return next();
                break;
//            default:
//              return
        }
        var clientname = req.session.Client.dbUrl;
        console.log(clientname+'<-----here')

    // test if models are not already compiled if so, skip
    if (/*typeof req.db === 'undefined' && */ typeof global.App.clientModel[clientname] === 'undefined') {
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        req.db = {};
     //Get files from models directory
     if(clientname == "admin"){
        glob("./admin/models/*.js",{"ignore":['index.js']}, function (err, files) {
            files.forEach(modelPath => {
                //Deduce/ extrapulate model names from the file names
                //Im not very good with regxp but this is what i had to do, to get the names from the filename e.g users.server.models.js (this is my naming convention, so as not to get confused with server side models and client side models
    
                var filename = modelPath.replace(/^.*[\\\/]/, '');
                var fullname = filename.substr(0, filename.lastIndexOf('.'));
                var ModelName = fullname.charAt(0).toUpperCase() + fullname.slice(1);
                ModelName = ModelName.slice(0,-1);
    
                var Schema = require(path.resolve(modelPath));
                req.db[ModelName] = global.App.activdb.model(fullname, Schema);
                console.log('the filename is ' + ModelName);
    
              });
            });

     }else{
     glob("./models/*.js",{"ignore":['index.js']}, function (err, files) {
        files.forEach(modelPath => {
            //Deduce/ extrapulate model names from the file names
            //Im not very good with regxp but this is what i had to do, to get the names from the filename e.g users.server.models.js (this is my naming convention, so as not to get confused with server side models and client side models

            var filename = modelPath.replace(/^.*[\\\/]/, '');
            var fullname = filename.substr(0, filename.lastIndexOf('.'));
            var ModelName = fullname.charAt(0).toUpperCase() + fullname.slice(1);
            ModelName = ModelName.slice(0,-1);

            var Schema = require(path.resolve(modelPath));
            req.db[ModelName] = global.App.activdb.model(fullname, Schema);
            console.log('the filename is ' + ModelName);

          });
        });
      }

        global.App.clientModel[clientname] = req.db;

        //console.log(global.App.clients);

        return next();
    }
    // since models exist, pass it to request.db for easy consumption in controllers
    req.db = global.App.clientModel[clientname];
    return next();
    };
}

module.exports = modelsInit;