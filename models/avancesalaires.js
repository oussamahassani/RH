var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


var AvancesalaireSchema = new mongoose.Schema({

    montant:   { type: String, required: true, unique: false},
    responsable:   { type: String, required: true, unique: false}, 
    datesoumission:  { type: String, required: true, unique: false},
    raison:  { type: String, required: true, unique: false},
    document: { type: String, required: true, unique: false},
    remarque: { type: String, required: false, unique: false},

  }, {timestamps: true});

  AvancesalaireSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
});
AvancesalaireSchema.pre('save', function(next) {
    next();
  });

  module.exports = AvancesalaireSchema;

  