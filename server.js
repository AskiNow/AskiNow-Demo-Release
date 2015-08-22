// requirements:
var express         = require('express'),
    morgan          = require('morgan'),
    bodyParser      = require('body-parser'),     // parsing http body content
    mongoose        = require('mongoose');
  
var app = express();

var jwt     = require('jsonwebtoken'); // create, sign and verify token
var config  = require('./config');
var User    = require('./models/user');

// here use the params in config.js file.
mongoose.connect(config.database);
app.set('superSecret', config.secret); // setup secret variable

// set up parser for different format and then could parse them
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// will output every request information
app.use(morgan('dev')); // standard apache combined logger

// routes
app.get('/', function(req, res) {
    res.send('hello world');
});
// sample user
app.get('/setup', function(req, res) {
    var nick = new User({
        name: 'nick',
        password: 'foobar',
        admin: true
    });
    nick.save(function(err) {
        if (err) throw err; // error handler
        console.log('User saved successfully');
        res.json({ success: true });
    });
});

// API routes
var apiRoutes = express.Router();
// routes that not need to be protected
apiRoutes.post('/authenticate', function(req, res) {
    User.findOne({ 
        // note that this name could be retrieved from body, not param
        name: req.body.name 
    }, function(err, user) {
        console.log(req.body);
        if (err) throw err;
        if (!user) {
            res.json({ success: false, message: "Authentication failed, user not found" });
        } else {
            if (user.password != req.body.password) {
                res.json({ success: false, message: "Authentication failed, wrong password" });
            } else {
                // jwt utilities
                // signup a token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresInMinutes: 1440
                });
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }
        }
    });
});
// should be protected. By using middleware
apiRoutes.use(function(req, res, next) {
    // token could be found in 3 different fields
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        // use jwt to do verification
        // jwt use secret on server to decode the token
        // the decoded result is the user
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: "Failed to authenticate token" });
            } else {
                // if this middleware passed.
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(403).send({
            success: false,
            message: 'No token provided'
        });
    }
});
// just put them after the middleware
apiRoutes.get('/', function(req, res) {
    res.json({ message: "Welcome!" });
});
apiRoutes.get('/users', function(req, res) {
    // retrieve all users from the database, without any condition.
    // use callback to transfer back data.
    User.find({}, function(err, users) {
        if (err) throw err;
        res.json(users);
    })
});

app.use('/api', apiRoutes);

app.listen(process.env.PORT, process.env.IP);

console.log('Magic happens at http://' + process.env.IP + ':' + process.env.PORT);