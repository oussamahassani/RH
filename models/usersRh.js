var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var contratSchema = new mongoose.Schema({
  
    type: {type:String,required: true, unique: false},
    datedebutc:{type:String,required: true, unique: false},
    datefinc:{type:String,required: true, unique: false},
    diplome: {type:String,required: true, unique: false},
    specialite :{type:String,required: true, unique: false},
    rib:{type:String,required: true, unique: 'RIB \"{VALUE}\", est déja utiliser'},
    banque:{type:String,required: true, unique: false},
    avantageNature:[{type:String,required: true, unique: false}],
    conge:{type:String,required: true, unique: false},
    situationfamiliale:{type:String,required: true, unique: false},
    nationalite:{type:String,required: false, unique: false}
  
})
var userRhSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: 'Nom d\'utilisateur \"{VALUE}\", est déja utiliser'},
    fname:    { type: String, required: true, unique: false},
    lname:    { type: String, required: true, unique: false},
    email:    { type: String, required: true, unique: 'Email \"{VALUE}\", est déja utiliser' },
    adress:   { type: String, required: true, unique: false},
    sexe:   { type: String, required: true, unique: false},
    tel:      { type: String, required: true, unique: true},
    cin:      { type: String, required: true, unique: true},
    salairebrut:  { type: String, required: true, unique: false},
    salairenet:  { type: String, required: true, unique: false},
    datenaissance: { type: Date, required: true, unique: false},
    poste: { type: String, required: true, unique: false},
    grade: { type: String, required: true, unique: false},
    departement: { type: String, required: true, unique: false},
    service: { type: String, required: true, unique: false},
    responsable:{type:mongoose.Schema.Types.ObjectId, ref:'usersrhs', required: function() { return this.grade != "Associé"; } },
    anciente: { type: String, required: true, unique: false},
    datecommencement: { type: Date, required: true, unique: false},
    contrat :contratSchema
    

  }, {timestamps: true});

  userRhSchema.plugin(beautifyUnique, {
    //defaultMessage: "Une erreur c\'est produit: "
});

userRhSchema.pre('save', function(next) {
    next();
  });

  module.exports = userRhSchema;

  module.exports.getUserById = function(id, callback){
    UserRh.findById(id,callback);
    
  }

  module.exports.getUserByEmail = function(email, callback){
    const query = {email : email} ;
    UserRh.findOne(query ,callback);
    
  }


  module.exports.comparePassword = function(candidatePass, hash, callback){
    bcrypt.compare(candidatePass,hash, (err, isMatch) => {
      if(err) throw err; 
      callback(null, isMatch) ;
    })
  }