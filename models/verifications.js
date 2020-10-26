var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const VerificationSchema = new mongoose.Schema({
  _clientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'myClients' },
  token: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 180000 }
})

VerificationSchema.plugin(beautifyUnique, {
   defaultMessage: "Une erreur dans la verification s\'est produite: "
});


VerificationSchema.pre('save', function(next) {
    next();
  });
 


 

module.exports = VerificationSchema;

  module.exports.getverificationById = function(id, callback){
    verification.findById(id,callback);
    
  }

  

