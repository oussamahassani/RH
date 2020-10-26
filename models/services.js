var mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var ServiceSchema = new mongoose.Schema({
    name : { type: String, required: true},
    montant : { type: String, default: '0.00'},
    client:    { type: String, required: true},
    clientConsult: { type: String, required: true},
    creatorId :{ type: String, required: true},
    coutEstim :{ type: String, default : '0.00'},
    coutFinal :{ type: String, default : '0.00'},
    date_deb :{ type: Date, required: false},
    date_fin :{ type: Date, required: false},
    finish_date :{type : String ,default:'En cours'},
    depart : {type:mongoose.Schema.Types.ObjectId, ref:'departement'},
    billed :{type: Boolean , default : false},
    tasks  : { type:[{
        clientSide :{type: Boolean , default : false},
        rapport:   { type: String, default : ""},
        timePassed : {type : Array, default : []},
        prio : {type : Number, default : 0 },
        task :  {type: String , required : true},
        parent : {type : String , default : 0 },
        cost : {type : String , default: '0.00'},
        user :  {type: String , required : 'Chaque tache doit etre affecté a un employée'},
        status: {type: String , required : true},
        helpers : {type : Array, default : []},
        finish_date :{type : String ,default:'En cours'},
        date_deb: {type: Date , required : true},
        date_fin: {type: Date , required : true},
        repeat : {type : Boolean,require : true},
        documents : {type:[{
          docName :  {type: String , required : false},
          docPath :  {type: String , required : false},
      }]},
     }], required:'il faut au moin une tâche'},
     clientDocs : {type:[{
       docType : {type: String , required : false},
       docs : {type:[{
        docName :  {type: String , required : false},
        docPath :  {type: String , required : false},
     }], default : []},
   }]}

    

  }, {timestamps: true});

  ServiceSchema.plugin(beautifyUnique, {
    defaultMessage: "Un erreur c\'est produit: "
});


 


 

  module.exports = ServiceSchema;

  module.exports.getServiceById = function(id, callback){
    Service.findById(id,callback);
    
  }


  module.exports.getServiceByClient = function(client, callback){
    const query = {client : client} ;
    Service.findOne(query ,callback);
    
  }

  module.exports.getServiceByCreator = function(creatorId, callback){
    const query = {creatorId : creatorId} ;
    Service.findOne(query ,callback);
    
  }




  

