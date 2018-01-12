// app/routes.js

    var express             = require('express');
    var router              = express.Router();
    var bodyParser          = require('body-parser');
    let Booking             = require('../models/booking.js');
    let Event               = require('../models/event.js');
    let ObjectID            = require('mongodb').ObjectID;

    /* GET users listing. */
    router.get('/', function(req, res, next) {
      res.send('respond with a resource');
    });


    router.get('/createbooking', isLoggedIn, function(req, res) {
        let param = {};
        Event.find((err, event) => {
            if(err){
                return res.status(500).json({ message: err.message, success: false }); 
            }
            if(!event){
                return res.status(404).json({message: 'Event not found.' , success: false });
            }
            param["eventArray"] = event;
             //console.log(param);

            //req.flash('success', 'Event added successfully');
           // res.locals.message = req.flash();
            
            res.render('createbooking', param);
            //res.status(200).json({ event: event, success: true });
        });
       // res.render('createbooking', { message: req.flash('createbookingMessage',''),user : req.user  });
        /*res.render('createevent.ejs', {
            user : req.user // get the user out of session and pass to template
        });*/

    });


    router.post('/createbooking', isLoggedIn, function(req, res) {
        //console.log(req.body.eventname);
        //return false;
        // asynchronous
        // User.findOne wont fire unless data is sent back
        //process.nextTick(function() {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        Booking.findOne({ 'local.name' :  req.body.name }, function(err, event) {
            // if there are any errors, return the error
            if(err){
                return res.status(500).json({message:err.message, success: false});
            }
            //console.log(event);
            // return
            // check to see if theres already a user with that email
            if (event) {
                 req.flash('success', 'That Booking is already exists.');
                 res.locals.message = req.flash();
                return res.redirect("/booking/bookinglisting");
                //return res.status(null, false, req.flash('eventMessage', 'That Booking is already exists.'));
            } else {
                // if there is no user with that email
                // create the user
                var newBooking              = new Booking();
                // set the user's local credentials
                newBooking.local.name       = req.body.name;
                newBooking.local.id_event   = req.body.id_event;
                newBooking.local.created    = new Date();
                newBooking.local.modify     = new Date();
                // save the user
                newBooking.save(function(err,doc1) {
                    console.log(err)
                    if (err) return res.status(500).json({ content: "false" , success: false });
                    //return done(null, newBooking);
                    ///return res.status(null, false, req.flash('eventMessage', 'That Event is saved.'));

                    req.flash('success', 'Booking added successfully');
                    res.locals.message = req.flash();

                    return res.redirect("/booking/bookinglisting");
                });
            }
        });   
    });



    router.get('/bookinglisting', isLoggedIn, function(req, res) {
        let param = {};
        param["page_title"] = "Bookings";
        param["breadcrumb"] = [
        {label: "Bookings", anchor: "#"}
         ];
        Booking.find().populate('local.id_event').exec(function (err, Bookings){
        if (err) {
        return res.serverError(err);
        }
        param["bookingArray"] = Bookings;
        //console.log(param.bookingArray[0].local.id_event);
        res.render('bookinglisting', param);
        //res.status(200).json({ event: event, success: true });
        });
    });


    router.get('/delete/:id',isLoggedIn,function(req, res){
        //console.log(req.params.id);
        //res.send('DELETE request to homepage'+req.params.id);
        Booking.remove({_id: req.params.id}, 
           function(err){
            return res.redirect("/booking/bookinglisting");
        });

    });

    router.get('/edit/:id', isLoggedIn, function(req, res){
        console.log(req.params.id);
        
        let param = {};

        Event.find((err, events) => {
            if (err) {
              req.flash("error", "event not found");
            }
            param["eventArray"] = events;
           /// console.log(param);
        });

        Booking.findOne({"_id": req.params.id}, (err, bookingResponse) => {
            if (err) {
              req.flash("error", "Booking not found");
              return res.redirect("/booking/bookinglisting");
            }
           //console.log(bookingResponse);
            param["bookingRecord"] = bookingResponse;
            console.log(param);
            res.render("bookingedit", param);
        });


        //res.send('Update request to homepage'+req.params.id);
    });


     router.post('/edit', isLoggedIn, function(req, res){
        let param = {};
        console.log(req.body.id);
        Booking.findById(req.body.id, (err, Booking) => {  
        // Handle any possible database errors
        if (err) {
            res.status(500).send(err);
        } else {
            // Update each attribute with any possible attribute that may have been submitted in the body of the request
            // If that attribute isn't in the request body, default back to whatever it was before.
            Booking.local.name = req.body.name;
            Booking.local.id_event = req.body.id_event;

            // Save the updated document back to the database
            Booking.save((err, Booking) => {
                if (err) {
                    res.status(500).send(err)
                }
                param["BookingRecord"] = Booking;
                //res.status(200).send(Event);
                //res.render("event/edit/"+req.body.id, param);
                return res.redirect("/booking/edit/"+req.body.id);
            });
        }
    });


        //res.send('Update request to homepage'+req.params.id);
    });





    module.exports = router;

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }