var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var documentAppelSchema = new mongoose.Schema({
    category    : [{type:mongoose.Schema.Types.ObjectId, ref:'categoryAppels'}],
    path        : { type: String, required: true},
    isRef        : { type: Boolean, required: true, default: false},
 
  }, {timestamps: true});

  documentAppelSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
});



 


 

  module.exports = documentAppelSchema;

  module.exports.getdocumentAppelById = function(id, callback){
    documentAppel.findById(id,callback);
    
  }

  module.exports.getdocumentAppelByDep = function(departement, callback){
    const query = {departement : departement} ;
    documentAppel.findOne(query ,callback);
    
  }

 


  
