var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

  var raisonAppelSchema = new mongoose.Schema({
    name:    { type: String, required: true, unique: 'La raison \"{VALUE}\", déjà exist.'},
 
  }, {timestamps: true});

  raisonAppelSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
});



 


 

 module.exports = raisonAppelSchema;

  module.exports.getraisonAppelById = function(id, callback){
    raisonAppel.findById(id,callback);
    
  }

  module.exports.getraisonAppelByDep = function(departement, callback){
    const query = {departement : departement} ;
    raisonAppel.findOne(query ,callback);
    
  }

 


  
