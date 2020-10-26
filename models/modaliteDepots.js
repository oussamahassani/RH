var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var modaliteDepotSchema = new mongoose.Schema({
    name:    { type: String, required: true, unique: 'Ce mode \"{VALUE}\", déjà exist.'},
 
  }, {timestamps: true});

  modaliteDepotSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
});

module.exports = modaliteDepotSchema;

  module.exports.getmodaliteDepotById = function(id, callback){
    modaliteDepot.findById(id,callback);
    
  }

  module.exports.getmodaliteDepotByDep = function(departement, callback){
    const query = {departement : departement} ;
    modaliteDepot.findOne(query ,callback);
    
  }

 


  
