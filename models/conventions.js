var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


var ConventionSchema = new mongoose.Schema({
    type:   { type: String, required: true, unique: false},
    description: { type: String, required: false, unique: false},
    adresse: {type: String, required: false, unique: false,}
  }, {timestamps: true});

  ConventionSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit:"
});
ConventionSchema.pre('save', function(next) {
    next();
  });

  module.exports = ConventionSchema;

  