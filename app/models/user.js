
// get the instance of mongoose and its schema
// schema is the description of a database
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

// model setup, and pass it to main server.js
module.exports = mongoose.model('User', new Schema({
    name: String,
    password: String,
    admin: Boolean
}));