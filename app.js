const compression = require('compression')
const express = require('express');
const app = express();
const session = require('express-session');
var helmet = require('helmet')
app.use(helmet())
app.use(session({ resave: true ,secret: '123456' , saveUninitialized: true}));
global.App = {
  clients : [],
  activdb: '',
  clientdbconn: [],
  clientModel: []
}
process.on('unhandledRejection', (error, promise) => {
  console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise);
  console.log(' The error was: ', error );
  process.exit(1); // exit application 

});
const clientListener = require('./middlewares/clientListener');
const setclientdb = require('./middlewares/setclientdb');
const modelsInit = require('./middlewares/modelsInit');
app.use(clientListener()); // checks and identify valid clients
app.use(setclientdb());// sets db for valid clients
app.use(modelsInit());// initilize models
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = express.Router();
app.use(compression())
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '20mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);
require('./admin/config/passport')(passport);


require('./routes')(app);
require('./admin/routes')(app);
require('./admin/functions/taskReminder')(app);


process.on('unhandledRejection', (error, promise) => {
  console.log(' Oh Lord! We forgot to handle a promise rejection here: ', promise);
  console.log(' The error was: ', error );
})

app.use(express.static(path.join(__dirname, 'public'),{ maxage: '864000' }));
  app.use(express.static(path.join(__dirname, 'website'),{ maxage: '864000' }));
  app.use(express.static(path.join(__dirname, 'adminApp'),{ maxage: '864000' }));

// Send all other requests to the Angular app
app.get('*', (req, res) => {
  console.dir(req.subdomains);
  if(req.subdomains === undefined || req.subdomains.length == 0 || req.subdomains[1] == 'www'){
    res.sendFile(path.join(__dirname, '/website/website.html'));
   }else{
    if(req.subdomains[1] === 'admin'){
      res.sendFile(path.join(__dirname, '/adminApp/admin.html'));
    }else{
      res.sendFile(path.join(__dirname, '/public/app.html'));
    }
  }
});



//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);
const server = http.createServer(app);

// Loading socket.io
var io = require('socket.io').listen(server);
app.io = io;

// When a client connects, we note it in the console
const users = {};
io.sockets.on('connection', function (socket) {
    console.log('A client is connected!');
    console.log('a user connected');
  socket.on('logedin', function(data){
    console.log('a user2 ' + data.userId + ' connected');
    // saving userId to array with socket ID
    users[socket.id] = data.userId;
  });
  socket.on('disconnect', function(){
    console.log('user ' + users[socket.id] + ' disconnected');
    // remove saved socket from users object
    delete users[socket.id];
  });
  io.emit('connected', users);
});








// server listen
server.listen(port, () => console.log(`Running on localhost:${port}`));
