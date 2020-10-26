var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var ModelTaskSchema = new mongoose.Schema({
    departement: { type: String, required: true },
    task:    { type: String, required: true, unique: false},
    time:    { type: Number, required: true},
    repeat : {type : Boolean,required : false},
    active : {type : Boolean,default : true}
  }, {timestamps: true});

  ModelTaskSchema.plugin(beautifyUnique, {
    defaultMessage: "Un erruer c\'est produit: "
});



 


 

  module.exports = ModelTaskSchema;

  module.exports.getModelTaskById = function(id, callback){
    ModelTask.findById(id,callback);
    
  }

  module.exports.getModelTaskByDep = function(departement, callback){
    const query = {departement : departement} ;
    ModelTask.findOne(query ,callback);
    
  }

 


  
