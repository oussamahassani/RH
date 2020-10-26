var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var documentOcrSchema = new mongoose.Schema({
    path        : { type: String, required: true},
 
  }, {timestamps: true});

  documentOcrSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
});

module.exports = documentOcrSchema;


 


  
