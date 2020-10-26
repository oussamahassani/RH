var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var FournisseurSchema = new mongoose.Schema({
    name: { type: String, required: true},
    mat_fis: { type: String, required: false},
    adresse: { type: String, required: false},
    active : {type : Boolean , default : true},

  }, {timestamps: true});

  FournisseurSchema.plugin(beautifyUnique, {
    defaultMessage: "Un erruer c\'est produit: "
});



 


 

  module.exports = FournisseurSchema;

  module.exports.getFournisseurById = function(id, callback){
    Fournisseur.findById(id,callback);
    
  }

  module.exports.getFournisseurByName = function(serviceName, callback){
    const query = {serviceName : serviceName} ;
    Fournisseur.findOne(query ,callback);
    
  }

 


  

