var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var categoryAppelSchema = new mongoose.Schema({
    name:    { type: String, required: true, unique: 'La categorie \"{VALUE}\", déjà exist.'},
 
  }, {timestamps: true});

  categoryAppelSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
});



 


 

  module.exports = categoryAppelSchema;

  module.exports.getcategoryAppelById = function(id, callback){
    categoryAppel.findById(id,callback);
    
  }

  module.exports.getcategoryAppelByDep = function(departement, callback){
    const query = {departement : departement} ;
    categoryAppel.findOne(query ,callback);
    
  }

 


  
