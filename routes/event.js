// app/routes.js

    var express             = require('express');
    var router              = express.Router();
    var bodyParser          = require('body-parser');
    let Event               = require('../models/event.js');

    /* GET users listing. */
    router.get('/', function(req, res, next) {
      res.send('respond with a resource');
    });


    router.get('/createevent', isLoggedIn, function(req, res) {
        res.render('createevent', { message: req.flash('createeventMessage',''),user : req.user  });
        /*res.render('createevent.ejs', {
            user : req.user // get the user out of saaaession and pass to template
        });*/

    });


    router.post('/createevent', isLoggedIn, function(req, res) {
        //console.log(req.body.eventname);
        //return false;
        // asynchronous
        // User.findOne wont fire unless data is sent back
        //process.nextTick(function() {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        Event.findOne({ 'local.name' :  req.body.eventname }, function(err, event) {
            // if there are any errors, return the error
            if(err){
                return res.status(500).json({message:err.message, success: false});
            }
            //console.log(event);
            // return
            // check to see if theres already a user with that email
            if (event) {
                 req.flash('success', 'That Event is already exists.');
                 res.locals.message = req.flash();
                res.render('createevent');
                //return res.status(null, false, req.flash('eventMessage', 'That Event is already exists.'));
            } else {
                // if there is no user with that email
                // create the user
                var newEvent              = new Event();
                // set the user's local credentials
                newEvent.local.name       = req.body.eventname;
                newEvent.local.created    = new Date();
                newEvent.local.modify     = new Date();
                // save the user
                newEvent.save(function(err,doc1) {
                    console.log(err)
                    if (err) return res.status(500).json({ content: "false" , success: false });
                    //return done(null, newEvent);
                    ///return res.status(null, false, req.flash('eventMessage', 'That Event is saved.'));

                    req.flash('success', 'Event added successfully');
                    res.locals.message = req.flash();

                    res.render('createevent');
                });
            }
        });   
    });



    router.get('/eventlisting', isLoggedIn, function(req, res) {
        let param = {};
        //param["page_title"] = "Customers";
        // param["breadcrumb"] = [
        //{label: "Customers", anchor: "#"}
        // ];
        Event.find((err, event) => {
            if(err){
                return res.status(500).json({ message: err.message, success: false }); 
            }
            if(!event){
                return res.status(404).json({message: 'Event not found.' , success: false });
            }
            param["userArray"] = event;
            console.log(param);
            res.render('eventlisting', param);
            //res.status(200).json({ event: event, success: true });
        });
       
    });


    router.get('/delete/:id',isLoggedIn,function(req, res){
        //console.log(req.params.id);
        //res.send('DELETE request to homepage'+req.params.id);
        Event.remove({_id: req.params.id}, 
           function(err){
            return res.redirect("/event/eventlisting");
        });

    });

    router.get('/edit/:id', isLoggedIn, function(req, res){
        console.log(req.params.id);
        let param = {};
        Event.findOne({"_id": req.params.id}, (err, eventResponse) => {
            if (err) {
              req.flash("error", "event not found");
              return res.redirect("/event/eventlisting");
            }
            console.log(eventResponse);
            param["eventRecord"] = eventResponse;
            console.log(param);
            res.render("eventedit", param);
        });

        //res.send('Update request to homepage'+req.params.id);
    });


     router.post('/edit', isLoggedIn, function(req, res){
        let param = {};
        console.log(req.body.id);
        Event.findById(req.body.id, (err, Event) => {  
        // Handle any possible database errors
        if (err) {
            res.status(500).send(err);
        } else {
            // Update each attribute with any possible attribute that may have been submitted in the body of the request
            // If that attribute isn't in the request body, default back to whatever it was before.
            Event.local.name = req.body.name;
            Event.local.description = req.body.description;

            // Save the updated document back to the database
            Event.save((err, Event) => {
                if (err) {
                    res.status(500).send(err)
                }
                param["eventRecord"] = Event;
                //res.status(200).send(Event);
                //res.render("event/edit/"+req.body.id, param);
                return res.redirect("/event/edit/"+req.body.id);
            });
        }
    }
    );


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