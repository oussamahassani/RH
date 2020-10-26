var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var DecaissementSchema = new mongoose.Schema({
    date: { type: Date, required: true},
    lib: { type: String, required: true},
    nature: { type: String, required: true},
    amount: { type: Number, required: true},
    four: { type: String, required: true},
    trash : {type: Array , default : []},
    payment :{type : Object ,required : false},

  }, {timestamps: true});

  DecaissementSchema.plugin(beautifyUnique, {
    defaultMessage: "Un erruer c\'est produit: "
});



 


 

  module.exports = DecaissementSchema;

  module.exports.getDecaissementById = function(id, callback){
    Decaissement.findById(id,callback);
    
  }



 


  

