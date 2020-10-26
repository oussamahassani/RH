var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


var CongeSchema = new mongoose.Schema({

    type:   { nom:{type: String, required: true, unique: false},
              dure:{type: Number, required: false, unique: false} },
    destinataire:      [{ type:mongoose.Schema.Types.ObjectId, ref:'users', unique: false}],
    datedebut:      { type: Date, required: true, unique: false},
    datefin:      { type: Date, required: true, unique: false},
    periode:  { type: Number, required: true, unique: false},
    solde:  { type: Number, required: true, unique: false, default:0},
    emmeteur: { type:mongoose.Schema.Types.ObjectId, ref:'users', unique: false},
    user: { type:mongoose.Schema.Types.ObjectId, ref:'users', unique: false},
    etat: { type: Number, required: false, unique: false, default:0},

  }, {timestamps: true});

  CongeSchema.plugin(beautifyUnique, {
    defaultMessage: "Une erreur c\'est produit: "
});
CongeSchema.pre('save', function(next) {
    next();
  });

module.exports = CongeSchema;

  