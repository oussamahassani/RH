var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var ConfigurationSchema = new mongoose.Schema({
    structure:[{
    name: { type: String, required: true},
    mat_fis:{ type: String, required: true},
    adress:{ type: String, required: false},
    image:{ type: String, required: true},
    email:{ type: String, required: true}
    }],
    postes : {type : Array, default : []},
  }, {timestamps: true});

  ConfigurationSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
});



 


 

module.exports = ConfigurationSchema;

  module.exports.getConfigurationById = function(id, callback){
    Configuration.findById(id,callback);
    
  }

  module.exports.getConfigurationByName = function(serviceName, callback){
    const query = {serviceName : serviceName} ;
    Configuration.findOne(query ,callback);
    
  }

 


  

