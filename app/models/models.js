
// get the instance of mongoose and its schema
// schema is the description of a database
var mongoose = require('mongoose');
var Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var EducationSchema = new Schema({
    school  : { type: String, index: true },
    start   : { type: String },
    end     : { type: String },
    field   : { type: String, default: '' },
    degree  : { type: String, default: '' },
    user_id : { type: ObjectId }
});

var WorkSchema = new Schema({
    company : { type: String, index: true },
    start   : { type: String },
    end     : { type: String },
    position: { type: String, default: '' },
    industry: { type: String, default: '' },
    user_id : { type: ObjectId }
})

var UserSchema = new Schema({
    email       : { type: String,   index: { unique: true } },
    pwdHash     : { type: String },
    name        : { type: String,   default: '' },
    admin       : { type: Boolean,  default: false },
    role        : { type: String,   default: '' },
    educations  : [EducationSchema],
    works       : [WorkSchema],
    location    : { type: String,   default: '' },
    description : { type: String,   default: '' }
})

// model setup, and pass it to main server.js
exports.User = mongoose.model('User', UserSchema);
exports.Education = mongoose.model('Education', EducationSchema);
exports.Work = mongoose.model('Work', WorkSchema);