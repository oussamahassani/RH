var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var adressSchema = new mongoose.Schema({
  country:  { type: String, required: true, unique: false},
  region:  { type: String, required: true, unique: false},
  postalCode:  { type: String, required: false, unique: false},

})

var MyClientSchema = new mongoose.Schema({
    name:     { type: String, required: true, unique: 'Societe \"{VALUE}\", existe.' },
    fname:    { type: String, required: true},
    lname:    { type: String, required: true},
    email:    { type: String, required: true, unique: 'Email \"{VALUE}\", est déja utiliser.' },
    ref  :    { type: String, required: true, unique: 'Email \"{VALUE}\", est déja utiliser.', default:  function() { return this.name; }},
    adress:   { type: String, required: true, unique: false, default:  function() { return this.name; }},
    tel:      { type: String, required: false, unique: 'Numero \"{VALUE}\", est déja utiliser.'},
    active:   { type: Boolean , default : true},
    demo:     { type: Boolean , default : true},
    mat_fis:  { type: String },
    size:     { type: String },
    subdomain:{type: String, required: true, unique: 'Domaine \"{VALUE}\", est déja utiliser.', default: ' ', trim: true, index: true, sparse: true},
    dbUrl:    {type: String, required: true, unique: 'Domaine \"{VALUE}\", est déja utiliser.', trim: true, index: true, sparse: true},
    verified: {type: Boolean, default: false}
  }, {timestamps: true});

  MyClientSchema.plugin(beautifyUnique, {
   defaultMessage: "Une erreur c\'est produit: "
});


MyClientSchema.pre('save', function(next) {
  var myClient = this;
  bcrypt.hash(myClient.password, null , null , function(err,hash){
    if(err) return next(err);
      myClient.password = hash;
      next();
  });
});
 
module.exports = MyClientSchema;
  
  module.exports.getMyClientById = function(id, callback){
    MyClient.findById(id,callback);
    
  }

  module.exports.getMyClientByDomain = function(subdomain, callback){
    const query = {subdomain : subdomain} ;
    MyClient.findOne(query ,callback);
  }
  
  module.exports.getMyClientByEmail = function(email, callback){
    const query = {email : email} ;
    MyClient.findOne(query ,callback);
    
  }
