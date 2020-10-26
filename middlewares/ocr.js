
const aws = require("aws-sdk");
const config = require("../config/config");
//const test = require('./test');
aws.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: config.region
});

var tva = [];
var tvaOnly = '';

function nearestLine(myLine, mySide){
  var nearestLine;
  var distance = 1;
  mySide.forEach(line => {
    var geo1 = myLine.Geometry.BoundingBox;
    var geo2 = line.Geometry.BoundingBox;
    var thisDistance = calcDistance(geo1,geo2);
    if(thisDistance < distance && myLine.Id != line.Id){
      nearestLine = line;
      distance = thisDistance;
    }
  });
  return nearestLine;
}

function hasNumber(myString) {
  return /\d/.test(myString);
}

function extractfrom(lines, keywords,attrib){
var candidate=[];
for(const [i,line] of lines.entries()) {
  var str = line.Text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  for(const [j,keyword] of keywords.entries()) {  
    if(str.includes(keyword)){
      if(checkForm(attrib,lines[i+1])){
      if(Math.abs(keyword.length-line.Text.length)<2 || parseFloat(lines[i+1].Text.replace(',', '.'))){
        var geo1 = line.Geometry.BoundingBox;
        var geo2 = lines[i+1].Geometry.BoundingBox;
        if(parseFloat(lines[i+1].Text.replace(',', '.')) || (calcDistance(geo1,geo2)<0.4 && calcAlignment(geo1.Top,geo2.Top)<0.02)){
          candidate.push({f: line.Text.trim(), s: lines[i+1].Text.trim()});
        } else {
          var tmp = nearestLine(line, lines);
          candidate.push({f: line.Text.trim(), s: tmp.Text.trim()});
        }
      } else{
        var tmp2 = line.Text.toLowerCase();
        if(keyword !='rue')
        candidate.push({f:keyword.trim(), s:tmp2.replace(keyword,'').trim()});
        else
        candidate.push({f:keyword.trim(), s:tmp2.trim()});
      }
     }
    }
    };
 };
 return(candidate);
}

function checkForm(attrib,line){
  if(attrib == 'numero'){
    return hasNumber(line);
  }else{
    return true;
  }
}

function calcDistance(geo1,geo2){
  return (Math.sqrt(Math.pow((geo2.Left-(geo1.Left+geo1.Width)),2)+Math.pow((geo2.Top-geo1.Top),2)));
}

function calcAlignment(top1,top2){
  return Math.abs(top1-top2);
}

function getTva(line,prevLine){
  if(line.Text.includes('%')){
    var index = line.Text.search(/\d/);
    var length = line.Text.indexOf('%') - index + 1;
    if(parseFloat(prevLine.Text.replace(',', '.')) && !prevLine.Text.includes('%') && ( calcAlignment(prevLine.Geometry.BoundingBox.Top,line.Geometry.BoundingBox.Top)<0.015)){
       var vat = {
          articlePrice : prevLine.Text, 
          vat : line.Text.substr(index,length).replace('%','')
         }; 
         tva.push(vat);
      }else{
        console.log('hello');
        tvaOnly = line.Text.substr(index,length);
      }
    }
  }

  
  


module.exports = async buffer => {    
  const textract = new aws.Textract({region: 'eu-west-1'});

  tva=[];
  tvaOnly = '';
    try{
// Set region
aws.config.region = config.awsRegion;
const params = {
  Document: {
    S3Object: {
      Bucket: 'ocrxpr',
      Name: buffer
    }
  }
};


const request = textract.detectDocumentText(params);
  const data = await request.promise();
  var lines =[];
  var confidence = 0;
  if (data && data.Blocks) {
        data.Blocks.forEach(d => {
        if(d.BlockType === "LINE"){
          lines.push(d);
          confidence+= parseFloat(d.Confidence);
        }
      });
      if(confidence/lines.length <90)
        return 'flou';

      var upperLeft = [];
      var upperRight = [];
      var bottom = [];
      var i = 0;
      while(lines[i]){
        var line = lines[i];
        getTva(line,lines[i-1]);
        var geo = line.Geometry.BoundingBox;
        //var geo2 = lines[i+1].Geometry.BoundingBox;
        if(parseFloat(geo.Top) < 0.5){//upper
          if((parseFloat(geo.Left) + parseFloat(geo.Width)) < 0.5){//left
            upperLeft.push(line);
            var geo2 = lines[i+1].Geometry.BoundingBox;
            if(calcDistance(geo,geo2)<0.8){
              console.log(lines[i+1].Text);
              upperLeft.push(lines[i+1]);
              i++;
            }
           }else {
            upperRight.push(line);
           }
         }else{//down
           bottom.push(line);
        }
        i++;
      };
      
      var date = [];
      var dateKeywords = ['date'];
      var total = [];
      var totalKeywords = ['payer','ttc','total ttc','total'];
      var clientname = [];
      var clientKeywords = ['doit','client','clt','facture a','envoyer a','a:','destinataire'];
      var clientmf =[]; 
      var fourmf = [];
      var mfKeywords = ['m.f','mf','matricule fiscale','m/f','ctva','mf:'];
      var adrKeywords = ['adresse','adress','adr','siege','rue'];
      var adresseClt = [];
      var adresseFour = [];
      var fourname;
      
      var numeroKeywords = ['numero','facture n','n°','facture n°'];
      var numero = [];

      numero = extractfrom(upperLeft,numeroKeywords,'numero');
      console.log("numero");
      console.log(numero)
      if(!hasNumber(numero)){
        numero.length = 0;
      } 
      if(!numero.length)
      numero = extractfrom(upperRight,numeroKeywords,'numero');
      total = extractfrom(bottom,totalKeywords,'total');
      fourname = lines[0].Text;
      clientname = extractfrom(upperLeft,clientKeywords,'clientname');
      adresseClt = extractfrom(upperLeft,adrKeywords,'adresse');
      date = extractfrom(upperLeft,dateKeywords,'date');
      if(!date.length){
        date = extractfrom(upperRight,dateKeywords,'date');
      }
      if(clientname.length){
        adresseFour = extractfrom(upperRight,adrKeywords,'adresse');
         clientmf = extractfrom(upperLeft,mfKeywords,'clientmf');
         fourmf = extractfrom(upperRight,mfKeywords,'fourmf');
      }else{
        clientname = extractfrom(upperRight,clientKeywords,'clientname');
        adresseClt = extractfrom(upperRight,adrKeywords,'adresse');
        adresseFour = extractfrom(upperLeft,adrKeywords,'adresse');
        clientmf = extractfrom(upperRight,mfKeywords,'clientmf'); 
        fourmf = extractfrom(upperLeft,mfKeywords,'fourmf');
      }

      if(!adresseFour)
      adresseFour = extractfrom(bottom,adrKeywords,'adresse');
      if(!adresseFour)
      adresseFour = extractfrom(upperRight,adrKeywords,'adresse');
      if(adresseFour.s == adresseClt)
      adresseFour.length = 0;

      if(!fourmf.length)
        fourmf = extractfrom(bottom,mfKeywords,'fourmf');

      fourmf.forEach(mf => {
        mf.s = mf.s.substring(mf.s.length - 17);
      });

      clientmf.forEach(mf => {
        mf.s = mf.s.substring(mf.s.length - 17);
      });


      // console.log(clientname);
      // console.log(clientmf);
      // console.log(date);
      // console.log(total);
      // console.log(fourname);
      // console.log(fourmf);

      result = {};
      if(clientname.length)
        result.clientName   = clientname[0].s;
      else
        result.clientName = "";
      if(clientmf.length)
        result.clientMF     = clientmf[0].s;
      else
        result.clientMF = "";
      if(adresseClt.length)
        result.adresseClt     = adresseClt[0].s;
      else
        result.adresseClt = "";
      if(date.length)  
        result.date         = date[0].s;
      else
        result.date = "";
        if(total.length)  
          result.total      = Math.max.apply(Math, total.map(function(o) { return parseFloat(o.s.replace(',', '.')); }));
        else
          result.total = "";
          if(fourname.length)  
          result.fourName   = fourname;
        if(fourmf.length)  
          result.fourMF     = fourmf[0].s;
        else
          result.fourMF = "";
        if(adresseFour.length)  
          result.adresseFour  = adresseFour[0].s;
        else
          result.adresseFour = "";
        if(numero.length)
          result.numero     = numero[0].s;       
        else
          result.numero = "";
         ///check if we used one vat only
         if(tva.length){
         let x = true;
         let tmp = tva[0].vat.replace('%','').trim();
         for(var i = 1;i < tva.length ; i++){
           if(tmp  != tva[i].vat.replace('%','').trim()){
             x = false;
           }
         }
         if(x == true){
         tvaOnly = tmp ;
        tva.length = 0 ;
        }
      }
        if(tvaOnly)  
        result.tvaOnly      = tvaOnly.replace('%','');
        else
        result.tvaOnly = "";
        if(tva.length){  
          result.tva        = tva;
        }else
        result.tva = "";
         result.lines= lines
         result.upperLeft = upperLeft;
         result.upperRight = upperRight;

      return result;
    }
  if (data && data.Blocks) {

  }

  // in case no blocks are found return undefined
  return undefined;
} catch (e) {
    console.log(e);
    console.log("leaving catch block");
  }

};