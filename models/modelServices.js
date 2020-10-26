var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var ModelServiceSchema = new mongoose.Schema({
    departement : {type : String,required : true},
    serviceName:    { type: String, required: true, unique: 'Le service \"{VALUE}\", déjà exist.'},
    tasks: { type: [String], required: 'Veuillez sélectionner au moins une tâche'},
    docsList : { type:Array, required : false ,default : []},
 
  }, {timestamps: true});

  ModelServiceSchema.plugin(beautifyUnique, {
    defaultMessage: "Un erruer c\'est produit: "
});



 


 

  module.exports = ModelServiceSchema;

  module.exports.getModelServiceById = function(id, callback){
    ModelService.findById(id,callback);
    
  }

  module.exports.getModelServiceByName = function(serviceName, callback){
    const query = {serviceName : serviceName} ;
    ModelService.findOne(query ,callback);
    
  }

 


  

