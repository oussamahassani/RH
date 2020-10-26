var express = require('express');
var _router = express.Router();
var multer = require('multer');
var path = require('path');
const passport  = require('passport') ; 
const fs = require('fs');
const config = require("../config/config");

aws = require('aws-sdk'), // ^2.2.41
bodyParser = require('body-parser'),
multer = require('multer'), // "multer": "^1.1.0"
multerS3 = require('multer-s3'); //"^1.4.1"

aws.config.update({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    region: config.region
});

s3 = new aws.S3();


var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'xprmain',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, Date.now()+'.'+file.originalname); //use Date.now() for unique file keys
        }
    })
}).single('file');;

_router.post('/upload', function(req,res,next){
    upload(req,res,function(err){
        if(err){
            return res.status(501).json({error:err});
        }
        console.log(req);
        //do all database record saving activity
        return res.json({originalname:req.file.originalname, uploadname:req.file.key});
    });
});

_router.post('/download', passport.authenticate('jwt', {session: false}), function(req,res,next){

    // download the file via aws s3 here
    var fileKey = req.body.filename;

    console.log('Trying to download file', fileKey);
        var options = {
        Bucket    : 'xprmain',
        Key    : fileKey,
    };

    res.attachment(fileKey);
    var fileStream = s3.getObject(options).createReadStream();
    fileStream.pipe(res);

});




module.exports = _router;