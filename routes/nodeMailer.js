const express = require('express');
const router = express.Router();
var nodemailer = require('nodemailer');

router.post('/contactUs', function(req, res, next) {
  var errorMSG = "";

		// NAME
		if (!req.body.name) {
		    errorMSG = " Name is required ";
		} else {
		    var name = req.body.name;
		}

		// EMAIL
		if (!req.body.email) {
		    errorMSG += " Email is required ";
		} else {
		   var email = req.body.email;
		}

		// MSG SUBJECT
		if (!req.body.sujet) {
		    errorMSG += " Subject is required ";
		} else {
		    var sujet = req.body.sujet;
		}


		// MESSAGE
		if (!req.body.message) {
		    errorMSG += " Message is required ";
		} else {
		    var message = req.body.message;
		}

		if(errorMSG){
      res.json({success:false, errorMSG});
      return;
      }
    
    //prepare email body text
		var Body = "<html>";
		Body += "<b>Nom: </b>"+name+" - ";
		Body += "<b>Email: </b>"+email+"<br/> <br/> ";
		Body += "<b>Subject: </b>"+sujet+"<br/><br/>";
		Body += "<b>Message: </b>"+message+"<br/>";
		Body += "</html>";
 
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'xprtunisie@gmail.com',
               pass: 'xpr.gmail147'
           }
       });
      var mailOptions = { from: 'contact@xpr.com.tn', to: 'admin@xpr.com.tn', subject: "New Message Received from website", html: Body };
      transporter.sendMail(mailOptions, function (err) {
          if (err) { return res.status(500).send({ success:false, msg: err.message }); }
          res.json({success:true, msg :"Un email été envoyé."});
      });

});


router.post('/demoRequest', function(req, res, next) {
  var errorMSG = "";

		// NAME
		if (!req.body.name) {
		    errorMSG = " Name is required ";
		} else {
		    var name = req.body.name;
		}
		// NAME
		if (!req.body.fname) {
		    errorMSG = " First Name is required ";
		} else {
		    var name = req.body.name;
		}

		// EMAIL
		if (!req.body.email) {
		    errorMSG += " Email is required ";
		} else {
		   var email = req.body.email;
		}

		// job
		if (!req.body.job) {
			errorMSG += " job is required ";
		} else {
			job = !req.body.job;
		}

		// number
		if (!req.body.number) {
			errorMSG += "number is required ";
		} else {
			number = !req.body.number;
		}

		// size
		if (!req.body.size) {
			errorMSG += "size is required ";
		} else {
			size = !req.body.size;
		}

		// country
		if (!req.body.country) {
			errorMSG += "country is required ";
		} else {
			country = !req.body.country;
		}
		// MESSAGE
		if (!req.body.message) {
		    var message = "Aucun Message";
		} else {
		    var message = req.body.message;
		}

		if(errorMSG){
      res.json({success:false, errorMSG});
      return;
      }
    
    //prepare email body text
		var Body = "<html>";
		Body += "<b>Nom: </b>"+name+" - ";
		Body += "<b>Email: </b>"+email+"<br/> <br/> ";
		Body += "<b>Poste: </b>"+job+"<br/><br/>";
		Body += "<b>Numero de tel: </b>"+number+"<br/>";
		Body += "<b>Nombre de collaborateurs: </b>"+size+"<br/>";
		Body += "<b>Pays: </b>"+country+"<br/>";
		Body += "<b>Message: </b>"+message+"<br/>";
		Body += "</html>";
 
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'xprtunisie@gmail.com',
               pass: 'xpr.gmail147'
           }
       });
      var mailOptions = { from: 'contact@xpr.com.tn', to: 'admin@xpr.com.tn', subject: "Demande de dêmo from website", html: Body };
      transporter.sendMail(mailOptions, function (err) {
          if (err) { return res.status(500).send({ success:false, msg: err.message }); }
          res.json({success:true, msg :"Un email été envoyé."});
      });

});



module.exports = router ;