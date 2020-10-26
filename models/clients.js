var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoosePaginate = require('mongoose-paginate-v2');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var ClientSchema = new mongoose.Schema({
    pm:       { type: Boolean},
    name:     { type: String, required: function() { return this.pm; }},
    fname:    { type: String, required: function() { return !this.pm; }},
    lname:    { type: String, required: function() { return !this.pm; }},
    email:    { type: String, required: true, unique: 'Email \"{VALUE}\", est déja utiliser' },
    ref  :    { type: String, required: false, unique: 'Référence \"{VALUE}\", est déja utiliser', default: ' ' },
    adress:   { type: String, required: false, unique: false, default: ' '},
    rib:      { type: Number,default: '', required: false, unique: false, default: ' '},
    bank:     { type: String,default: '', required: false, unique: false, default: ' '},
    password: { type: String, required: 'Mot de passe requis', unique: false},
    tel:      { type: String, required: false, unique: 'Numero \"{VALUE}\", est déja utiliser', default: ' '},
    fax:      { type: String, required: false, trim: true, index: true, unique: false, default: ' '},
    mat_fis:  { type: String, required: false,  trim: true, index: true, sparse: true, default: ' '},
    porteur:  { type: mongoose.Schema.Types.ObjectId, ref:'users', unique: false}, 
    structure:{ type: mongoose.Schema.Types.ObjectId, ref:'structure', unique: false}, 
    active:   { type: Boolean , default : true},
  }, {timestamps: true});

  ClientSchema.plugin(beautifyUnique, {
   defaultMessage: "Une erreur c\'est produit: "
});

ClientSchema.plugin(mongoosePaginate);
ClientSchema.index({name: 'text',fname:'text',lname:'text',email:'text',tel:'text',adress:'text'});

ClientSchema.pre('save', function(next) {
  var client = this;
  bcrypt.hash(client.password, null , null , function(err,hash){
    if(err) return next(err);
      client.password = hash;
      next();
  });
});
 
  module.exports = ClientSchema;



  

