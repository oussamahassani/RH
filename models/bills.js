var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var BillSchema = new mongoose.Schema({
    numero :     { type: String, required: true},
    amount:      { type: String, required: true},
    paid_status: { type: Boolean, required: true, default: false},
    sent:        { type: Boolean, required: true, default: false},
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    vat: { type: Number },
    rs: { type: Number },
    timbre: { type: Number },
    rsPercent: { type: Number },
    payment :{type : Object, required : false},
    type: { type: Number,required : true },
    debour: { type: Number },
    debours: { type: Array, default : []},
    trash: { type: Array, default : []},

    service: { type: String, required: false},
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'clients'
  }
}, {timestamps: true});

  BillSchema.plugin(beautifyUnique, {
   defaultMessage: "Une erreur c\'est produit: "
});


BillSchema.pre('save', function(next) {
    next();
  });
 


 

  module.exports = BillSchema;

  module.exports.getbillById = function(id, callback){
    bill.findById(id,callback);
    
  }

  module.exports.getBillBynumero = function(numero, callback){
    const query = {numero : numero} ;
    bill.findOne(query ,callback);
    
  }

