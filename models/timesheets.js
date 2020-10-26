var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var TimesheetSchema = new mongoose.Schema({
    month: { type: String, required: true},
    year: { type: String, required: true},
    user : {type :String,required :true},
    update :{type: Array,default :[]},
    data: { type: Array, default:[], required: true},

  }, {timestamps: true});

  TimesheetSchema.plugin(beautifyUnique, {
    defaultMessage: "Un erruer c\'est produit: "
});



 


 

  module.exports = TimesheetSchema;



 


  

