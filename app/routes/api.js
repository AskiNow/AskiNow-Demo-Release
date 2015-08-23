

// requirements for this api router
var express         = require('express'),
    mongoose        = require('mongoose'),
    jwt             = require('jsonwebtoken'), // create, sign and verify token
    bcrypt          = require('bcrypt');

// configuration and model
var config  = require('../../config');
var models  = require('../models/models');

var User        = models.User;
var Education   = models.Education;
var Work        = models.Work;

// here use the params in config.js file.
// connect to mongodb
mongoose.connect(config.database);
var secret = config.secret;
var apiRoutes = express.Router();



// ------------- TOKENS ---------------------------------
/**
 * @api {post} /tokens Request token for user
 * @apiName GetToken
 * @apiGroup Token
 * @apiParam {String} email     Mandatory user email
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
 *      { "error": "User's email not found" }
 *      or
 *      { "error": "Invalid password" }
 */
apiRoutes.post('/tokens', function(req, res) {
    User.findOne({
        // find by email value
        email: req.body.email
    }, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.status(422).json({ error: "User's email not found" });
        } else {
            if (!bcrypt.compareSync(req.body.password, user.pwdHash)) {
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

// ------------- USERS ---------------------------------

/**
 * @api {get} /users Get a list of existing users
 * @apiName GetUsers
 * @apiGroup User
 * 
 * @apiParam {String} [role] Select users by role name, like student or teacher
 * 
 * 
 */

apiRoutes.get('/users', function(req, res) {
    // retrieve all users from the database, without any condition.
    // use callback to transfer back data.
    User.find({
        role: req.query.role
    }, function(err, users) {
        if (err) throw err;
        res.json(users);
    })
});

/** 
 * @api {post} /users Create a new user
 * @apiName CreateUser
 * @apiGroup User
 * 
 * @apiParam {String} email                 Mandatory email
 * @apiParam {String} password              Mandatory password
 * 
 * @apiDescription Create a new user by using email, user name and password
 * 
 * @apiSuccess (Success 201) {String} message Message of successfullt created
 */
apiRoutes.post('/users', function(req, res) {
    // enabled by body-parser
    var email = req.body.email;
    var password = req.body.password;

    // Now using blocking process
    var hash = bcrypt.hashSync(password, 10);
    var newUser = new User({email: email, pwdHash: hash, admin: false});
    newUser.save(function(err) {
        if (err) {
            res.status(422).json({ error: "Can't create user" });
        } else {
            res.status(201).json({ message: "User created" });
        }
    })
});

// should be protected. By using middleware
apiRoutes.use(function(req, res, next) {
    console.log(req.method);
    if (req.method == 'GET') {
        next();
    } else {
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
    }
});

/**
 * @api {patch} /users Update user profile
 * @apiName UpdateUser
 * @apiGroup User
 * 
 * @apiParam {String} [role]        Update user's role
 * @apiParam {String} [name]        Update user's name
 * @apiParam {String} [location]    Update user's location
 * @apiParam {String} [description] Update user's description
 * 
 * @apiSuccess {Number} modified    Number of fields modified
 * 
 */

apiRoutes.patch('/users', function(req, res) {
    var email = req.decoded.email; // user email for this method
    User.findOne({ email: email }, function(err, user) {
        if (err) throw err;
        User.update(user, {
            name           : req.body.name,
            role           : req.body.role,
            location       : req.body.location,
            description    : req.body.description
        }, function(err, raw) {
            if (err) throw err;
            res.status(200).json({ modified: raw.nModified });
        });
    })
})

/**
 * @api {post} /users/educations Create education experience for user
 * @apiName CreateUserEducation
 * @apiGroup User
 * 
 * @apiParam {String} school    School name
 * @apiParam {String} start     Education start year
 * @apiParam {String} end       Education end year
 * @apiParam {String} field     Field of study
 * @apiParam {String} degree    Degree of this education
 * @apiParam {String} token     Token of a specific user
 * 
 * @apiDescription This method could only be called with token in the header, 
 *      the server will get the corresponding user for this method, and add 
 *      this new education experience to him/her.
 * 
 * @apiSuccess (Success 201) {Object} education Recently created education
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 201 Created
 *      { 
 *          education: { 
 *              school: "Peking University",
 *              start:  "2012",
 *              end:    "2016",
 *              field:  "Computer Science",
 *              degree: "Bachelor",
 *              user_id:"55d8c2b4227db5b920e05c18"
 *          }, 
 *          "_id":"55d8c4860b52c9a925e24b97"
 *      }
 */
apiRoutes.post('/users/educations', function(req, res) {
    var email = req.decoded.email; // user email for this method
    console.log(email);
    User.findOne({ email: email }, function(err, user) {
        if (err) throw err;
        user.educations.push({
            school: req.body.school,
            start:  req.body.start,
            end:    req.body.end,
            field:  req.body.field,
            degree: req.body.degree,
            user_id:user._id
        });
        user.save(function(err) {
            if (err) throw err;
            res.status(201).json({education: user.educations[user.educations.length-1]});
        });
    });
});

/**
 * @api {post} /users/works Create work experience for user
 * @apiName CreateUserWork
 * @apiGroup User
 * 
 * @apiParam {String} company   Company name
 * @apiParam {String} start     Work experience start year
 * @apiParam {String} end       Work experience end year
 * @apiParam {String} position  Position in the comany
 * @apiParam {String} industry  Company's industry
 * @apiParam {String} token     Token of a specific user
 * 
 * @apiDescription This method could only be called with token in the header, 
 *      the server will get the corresponding user for this method, and add 
 *      this new work experience to him/her.
 * 
 * @apiSuccess (Success 201) {Object} work Recently created work
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 201 Created
 *      { 
 *          work: { 
 *              company:    "Morgan Stanley",
 *              start:      "2012",
 *              end:        "2016",
 *              position:   "Stuff",
 *              industry:   "Financial",
 *              user_id:    "55d8c2b4227db5b920e05c18"
 *          }, 
 *          "_id":"55d8c6d9b990e0122b78de95"
 *      }
 */
apiRoutes.post('/users/works', function(req, res) {
    var email = req.decoded.email; // user email for this method
    User.findOne({ email: email }, function(err, user) {
        if (err) throw err;
        user.works.push({
            company:    req.body.company,
            start:      req.body.start,
            end:        req.body.end,
            position:   req.body.position,
            industry:   req.body.industry,
            user_id:    user._id
        });
        user.save(function(err) {
            if (err) throw err;
            res.status(201).json({work: user.works[user.works.length-1]});
        });
    })
});

// ----------------- SEARCH ------------------

/**
 * @api {get} /search Search for user
 * @apiName GetSearch 
 * @apiGroup Search
 * 
 * @apiParam {String} keyword Keyword to search
 * 
 * @apiDescription The main query entrance for searching user. 
 * 
 * @apiSuccess {Object[]} users A list of matched users
 */

apiRoutes.get('/search', function(req, res) {
    console.log(req.query);
    User.find({ $or: [
        { 'role':               new RegExp(req.query.keyword, "i") },
        { 'name':               new RegExp(req.query.keyword, "i") },
        { 'location':           new RegExp(req.query.keyword, "i") }, 
        { 'description':        new RegExp(req.query.keyword, "i") },
        { 'educations.school':  new RegExp(req.query.keyword, "i") },
        { 'educations.field':   new RegExp(req.query.keyword, "i") },
        { 'educations.degree':  new RegExp(req.query.keyword, "i") },
        { 'works.company':      new RegExp(req.query.keyword, "i") },
        { 'works.position':     new RegExp(req.query.keyword, "i") },
        { 'works.industry':     new RegExp(req.query.keyword, "i") }
    ]}, function(err, users) {
        if (err) throw err;
        res.json({users: users});
    });
});

// ------- 

exports.apiRoutes = apiRoutes;
exports.secret = secret;
exports.getUserByToken = function(token, secret) {
    console.log('called');
    var result = null;
    jwt.verify(token, secret, function(err, decoded) {
        if (err) throw err;
        result = decoded;
    });
    console.log(result);
    return result;
}