// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var EventSchema = mongoose.Schema({
    local            : {
        name         : String,
        created      : String,
        modify       : String,
        description  : String,
    }

},{collections: 'Event'});

// create the model for users and expose it to our app
module.exports = mongoose.model('Event', EventSchema);
