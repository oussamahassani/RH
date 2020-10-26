var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var BanqueSchema = new mongoose.Schema({
    nom: { type: String, required: true},
    adresse: { type: String, required: true},
    rib: { type: Number, required: true},
    active : {type : Boolean , default : true},

  }, {timestamps: true});

  BanqueSchema.plugin(beautifyUnique, {
    defaultMessage: "Un erruer c\'est produit: "
});



 


 

  module.exports = BanqueSchema;

  module.exports.getBanqueById = function(id, callback){
    Banque.findById(id,callback);
    
  }



 


  

