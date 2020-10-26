var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var DepartementSchema = new mongoose.Schema({
    name: { type: String, required: true},
    services : {type : Array,default: []},

  }, {timestamps: true});

  DepartementSchema.plugin(beautifyUnique, {
    defaultMessage: "Un erruer c\'est produit: "
});



 


 

  module.exports = DepartementSchema;

  module.exports.getDepartementById = function(id, callback){
    Departement.findById(id,callback);
    
  }

  module.exports.getDepartementByName = function(serviceName, callback){
    const query = {serviceName : serviceName} ;
    Departement.findOne(query ,callback);
    
  }

 


  

