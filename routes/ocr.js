var express = require('express');
var _router = express.Router();
var multer = require('multer');
const ocr = require("../middlewares/ocr");
const config = require("../config/config");

const passport  = require('passport') ; 

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
        bucket: 'ocrxpr',
        key: function (req, file, cb) {
            console.log(file.originalname);
            cb(null, Date.now()+'.'+file.originalname); //use Date.now() for unique file keys
        }
    }),
    onFileUploadComplete: function (file) {
        console.log(file.originalname + ' uploaded to ' + file.uploadname)
        }
}).single('file');;

_router.post('/upload', function(req,res,next){
    upload(req,res, async function(err){
        if(err){
            return res.status(501).json({error:err});
        }
        return res.json({originalname:req.file.originalname, uploadname:req.file.key});

    });
});


_router.post('/tetractIt', async function(req,res,next){

    // download the file via aws s3 here
    var fileKey = req.body.filename;

    console.log('Trying to download file', fileKey);
    console.log(req.body);
    var success = false;            
    const results = await ocr(fileKey);
    if(results){
     success = true;
     }
    return res.json({result: results ,success:success, msg :"Fichier traité avec succès"});

});

module.exports = _router;
