// requirements:
var express         = require('express'),
    subdomain       = require('express-subdomain'),
    morgan          = require('morgan'),
    bodyParser      = require('body-parser'),     // parsing http body content
    mongoose        = require('mongoose');
  
var app = express();

// set up parser for different format and then could parse them
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// will output every request information
app.use(morgan('dev')); // standard apache combined logger

// routes
app.get('/', function(req, res) {
    res.send('hello world');
});
// API doc route
app.use('/apidoc', express.static(__dirname + '/apidoc'));
// API routes
var apiRoutes = require('./app/routes/api');
app.use('/api', apiRoutes);
// should use subdomain in product level
app.use(subdomain('api', apiRoutes));

app.listen(process.env.PORT, process.env.IP);

console.log('AskiNow API server at http://' + process.env.IP + ':' + process.env.PORT);