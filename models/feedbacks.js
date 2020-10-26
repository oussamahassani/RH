var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoosePaginate = require('mongoose-paginate-v2');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var feedbackSchema = new mongoose.Schema({
    libelle: { type: String, required: true},
    type: {type: Number,required: true, default: 0},
    etat: {type: Number, default: 0},
    description: { type: String, required: false},
    files      : [{type:String}],
    subdomain  : { type: String, required: false}
}, {timestamps: true});

feedbackSchema.plugin(mongoosePaginate);
feedbackSchema.index({ libelle: 'text', description: 'text', subdomain: 'text'});
  feedbackSchema.plugin(beautifyUnique, {
    defaultMessage: "Un erruer c\'est produit: "
});



 


 

  module.exports = feedbackSchema;

  module.exports.getfeedbackById = function(id, callback){
    feedback.findById(id,callback);
    
  }

  module.exports.getfeedbackByName = function(serviceName, callback){
    const query = {serviceName : serviceName} ;
    feedback.findOne(query ,callback);
    
  }

 


  

