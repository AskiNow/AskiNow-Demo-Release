


// requirements for this api router
var express         = require('express'),
    mongoose        = require('mongoose'),
    jwt             = require('jsonwebtoken'); // create, sign and verify token

// configuration and model
var config  = require('../../config');
var User    = require('../models/user');

// here use the params in config.js file.
// connect to mongodb
mongoose.connect(config.database);
var secret = config.secret;

var apiRoutes = express.Router();
// routes that not need to be protected

/**
 * @api {post} /tokens Request token for user
 * @apiName PostToken
 * @apiGroup Token
 * @apiParam {String} name      Mandatory user name
 * @apiParam {String} password  Mandatory password 
 * 
 * @apiDescription Fetch an authorization token for user
 * with correct username and password
 * 
 * @apiSuccess {String} token Authentication token for the user
 * @apiSuccessExample {json} Success-Response 
 *      HTTP/1.1 200 OK
 *      { "token": "eyJ0eXAiOiJKV1QiLCJhbGciO(...)" }
 * 
 * @apiError 422 Invalid username password combination
 * @apiErrorExample {json} Error-Response:
 *      HTTP/1.1 422 Unprocessable Entity
 *      { "error": "User not found" }
 *      or
 *      { "error": "Invalid password" }
 * @apiExample {curl} Example Usage:
 *      curl -i -X POST -d "name=[username]&password=[password]" \
 *          http://api.askinow.com/v1/tokens
 */
apiRoutes.post('/tokens', function(req, res) {
    User.findOne({ 
        // note that this name could be retrieved from body, not param
        name: req.body.name 
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.status(422).json({ error: "User not found" });
        } else {
            if (user.password != req.body.password) {
                res.status(422).json({ error: "Invalid password" });
            } else {
                // jwt utilities
                // signup a token
                var token = jwt.sign(user, secret, {
                    expiresInMinutes: 1440
                });
                res.json({ token: token });
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
        jwt.verify(token, secret, function(err, decoded) {
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

module.exports = apiRoutes;