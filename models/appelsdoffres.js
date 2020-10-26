var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

var appelFormSchema = new mongoose.Schema({
  date_depot    : {type: Date, required: true, unique: false},
  mode_depot    : [{type:mongoose.Schema.Types.ObjectId, ref:'modaliteDepots'}],
  adresse_depot : [{type: Object, required: true, unique: false}],
  provision     : { type: Boolean},
  bank          : { type: String, required: function() { return this.provision; }},
  montant       : { type: String, required: function() { return this.provision; }}
})


var AppeldoffreSchema = new mongoose.Schema({
    ste       : { type: String, required: true},
    reference       : { type: String, required: true, unique: false},
    titre           : { type: String, required: true},
    category        : [{type:mongoose.Schema.Types.ObjectId, ref:'categoryAppels'}],
    users           : [{type:mongoose.Schema.Types.ObjectId, ref:'users'}],
    createdBy       : {type:mongoose.Schema.Types.ObjectId, ref:'users'},
    files           : [{type:String}],
    filesCreated    :  {type:[{
      docPath :  {type: String },
      status :  {type: String , default:0},
      commentaire :  {type: String , default:'Aucun commentaire'},
   }]},
    commentaire     : { type: String, },
    status          : { type: String, default:0},
    etat            : { type: String, default:0},
    raison          : [{ type:mongoose.Schema.Types.ObjectId, ref:'users', required: function() { return this.etat == 3 }}],
    formulaire      : appelFormSchema

  }, {timestamps: true});

  AppeldoffreSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
});

  AppeldoffreSchema.pre('save', function(next) {
    var appeldoffre = this;
    bcrypt.hash(appeldoffre.password, null , null , function(err,hash){
      if(err) return next(err);
        appeldoffre.password = hash;
        next();
    });
  });


 

  module.exports = AppeldoffreSchema;

  module.exports.getAppeldoffreById = function(id, callback){
    Appeldoffre.findById(id,callback);
    
  }

  module.exports.getAppeldoffreByEmail = function(email, callback){
    const query = {email : email} ;
    Appeldoffre.findOne(query ,callback);
    
  }


  module.exports.comparePassword = function(candidatePass, hash, callback){
    bcrypt.compare(candidatePass,hash, (err, isMatch) => {
      if(err) throw err; 
      callback(null, isMatch) ;
    })
  }

