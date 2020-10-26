var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


var AttestationSchema = new mongoose.Schema({
    type:   { type: String, required: true, unique: false},
    raison: { type: String, required: true, unique: false},
    user: { type:mongoose.Schema.Types.ObjectId, ref:'users', unique: false},
    etat: { type: Number, required: false, unique: false, default:0},
    file: {type: String, required: false, unique: false,}
  }, {timestamps: true});

  AttestationSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit:"
});
AttestationSchema.pre('save', function(next) {
    next();
  });

  module.exports = AttestationSchema;

  