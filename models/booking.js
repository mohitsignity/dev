// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
// define the schema for our user model
var BookingSchema = mongoose.Schema({
    local            : {
        name         : String,
        created      : String,
        // id_event     : String,
        modify       : String,
        description  : String,
        id_event     : { type: Schema.Types.ObjectId, ref: 'Event' }
    }

},{collections: 'Booking'});

// create the model for users and expose it to our app
module.exports = mongoose.model('Booking', BookingSchema);
