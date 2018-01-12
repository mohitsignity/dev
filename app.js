var express 		= 	require('express');
var path 			= 	require('path');
var app 			= 	express();
var favicon 		= 	require('serve-favicon');
var mongoose 		= 	require('mongoose');
var passport 		= 	require('passport');
var flash    		= 	require('connect-flash');
var logger 			= 	require('morgan');
var cookieParser 	= 	require('cookie-parser');
var bodyParser 		= 	require('body-parser');
var session      	= 	require('express-session');
var configDB 		= 	require('./config/database.js');
var event        	= 	require('./routes/event');
var booking        	= 	require('./routes/booking');
console.log(configDB);

mongoose.connect(configDB.database);
require('./config/passport')(passport); 


//var index 			= 	require('./routes/indexs');
//var users 			= 	require('./routes/users');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'signity' }));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

//app.use('/', index);
app.use('/event', event);
app.use('/booking', booking);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
