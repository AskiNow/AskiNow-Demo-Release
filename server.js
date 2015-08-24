// requirements:
var express         = require('express'),
    subdomain       = require('express-subdomain'),
    morgan          = require('morgan'),
    bodyParser      = require('body-parser'),     // parsing http body content
    mongoose        = require('mongoose'),
    jwt             = require('jsonwebtoken');
    
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// set up parser for different format and then could parse them
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// will output every request information
app.use(morgan('dev')); // standard apache combined logger

// routes
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// API routes
// API doc route
app.use('/docs', express.static('./app/apidoc'));
var api = require('./app/routes/api');
var apiRoutes = api.apiRoutes;
app.use('/api', apiRoutes);

// should use subdomain in product level
// app.use(subdomain('api', apiRoutes));

http.listen(process.env.PORT, process.env.IP, function(){
    console.log('AskiNow API server at http://' + process.env.IP + ':' + process.env.PORT);
});

// --- SOCKET IO ---

// -- multiple users -- 
var sockets = {};

io.on('connection', function(socket){
    socket.broadcast.emit('hi');
    
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('chat message', function(data){
        jwt.verify(data.token, api.secret, function(err, decoded) {
            if (err) throw err;
            var from = decoded.name;
            var to   = data.to;
            var msg  = data.msg;
            console.log('from ' + from + ' send to ' + to + ' with: ' + msg);
            if (sockets[to]) {
                sockets[to].emit('chat message', {from: from, to: to, msg: msg});
                sockets[from].emit('chat message', {from: from, to: to, msg: msg});
            }
            else {
                sockets[from].emit('chat message', {from: 'server', to: from, msg: "user " + to + " not online"});
            }
                
        });
    });
    socket.on('join', function(token) {
        jwt.verify(token, api.secret, function(err, decoded) {
            if (err) throw err;
            var name = decoded.name;
            console.log('joined: ' + decoded.name);
            sockets[name] = socket;
            console.log('created socket for ' + name + ' with id ' + socket.id);
            sockets[name].emit('join success', 'hello ' + name + '!');
            sockets[name].emit('login', { name: name });
        });
    });
});
