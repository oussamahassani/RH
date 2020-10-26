var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


var FactureSchema = new mongoose.Schema({
   ocr : Object,
   user : Object,
   percentage : Number
  }, {timestamps: true});

  FactureSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
});




module.exports = FactureSchema;
