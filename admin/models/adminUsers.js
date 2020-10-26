var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var contratSchema = new mongoose.Schema({
  
  type: {type:String,required: true, unique: false},
  datedebutc:{type:String,required: true, unique: false},
  datefinc:{type:String,required: function() { return this.type != 'CDI'; }, unique: false},
  diplome: {type:String,required: true, unique: false},
  specialite :{type:String,required: true, unique: false},
  rib:{type:String,required: true, unique: 'RIB \"{VALUE}\", est déja utiliser'},
  banque:{type:String,required: true, unique: false},
  avantageNature:{type:String,required: false, unique: false},
  avantageNatureValeur:{type:String,required: false, unique: false},
  conge:{type:String,required: true, unique: false},
  situationfamiliale:{type:String,required: true, unique: false},
  nationalite:{type:String,required: false, unique: false},
  salairebrut:  { type: String, required: true, unique: false},
  salairenet:  { type: String, required: true, unique: false},
  cnss:  { type: String, required: false, unique: false},

})


var AdminUserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: 'Nom d\'utilisateur \"{VALUE}\", est déja utiliser'},
    fname:    { type: String, required: true, unique: false},
    lname:    { type: String, required: true, unique: false},
    email:    { type: String, required: true, unique: 'Email \"{VALUE}\", est déja utiliser' },
    password: { type: String, required: true, unique: false},
    adress:   { type: String, required: true, unique: false},
    sexe:   { type: String, required: true, unique: false},
    cin:      { type: String, required: true, unique: 'CIN \"{VALUE}\", est déja utiliser'},
    datenaissance: { type: Date, required: true, unique: false},
    poste: { type: String, required: true, unique: false},
    grade: { type: Number, required: true, unique: false},
    departement: [{ type: String, required: true, unique: false}],
    service: { type: String, required: true, unique: false},
    responsable:[{type:mongoose.Schema.Types.ObjectId, ref:'adminUsers', required: function() { return this.grade != 100; } }],
    anciente: { type: String, required: true, unique: false},
    datecommencement: { type: Date, required: true, unique: false},
    contrat : contratSchema,
    image:    { type: String, unique: false},
    gender:   { type: String, unique: false},
    tel:      { type: String, required: true, unique: 'Numero de téléphone \"{VALUE}\", est déja utiliser'},
    active :  {type : Boolean , default : true},

    permissions:[{type:mongoose.Schema.Types.ObjectId,ref:'groupes'}]
  }, {timestamps: true});

  AdminUserSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
});

  AdminUserSchema.pre('save', function(next) {
    var adminUser = this;
    bcrypt.hash(adminUser.password, null , null , function(err,hash){
      if(err) return next(err);
        adminUser.password = hash;
        next();
    });
  });


 

  module.exports.getAdminUserById = function(id, callback){
    AdminUser.findById(id,callback);
    
  }

  module.exports.getAdminUserByEmail = function(email, callback){
    const query = {email : email} ;
    AdminUser.findOne(query ,callback);
    
  }


  module.exports.comparePassword = function(candidatePass, hash, callback){
    bcrypt.compare(candidatePass,hash, (err, isMatch) => {
      if(err) throw err; 
      callback(null, isMatch) ;
    })
  }


module.exports = AdminUserSchema;

