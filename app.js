var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// this is what we require
var dotenv = require('dotenv').config()
var session = require('express-session')({secret: process.env.SESSION_SECRET,resave: false,saveUninitialized: false});
var mongoose = require("mongoose");
var passport = require("passport");
var User = require("./models/user");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var flash = require('connect-flash');

// database connection
try {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
} catch(err) {
  // Handle error
  console.log(err);
}

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var codenamesRouter = require('./routes/codenames');
var managersRouter = require('./routes/managers');
var customersRouter = require('./routes/customers');
var terminalsRouter = require('./routes/terminals');
var nicknamesRouter = require('./routes/nicknames');
var servicesRouter = require('./routes/services');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// use Passport and session for auth
app.use(express.urlencoded({ extended: false }));
app.use(session);

// initialise passport with current session
app.use(passport.initialize());
app.use(passport.session());

// configure passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash messages
app.use(flash());
app.use((req,res,next) => {
  res.locals.success = req.flash('success');
  res.locals.error  = req.flash('error');
next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/codenames', codenamesRouter);
app.use('/managers', managersRouter);
app.use('/customers', customersRouter);
app.use('/terminals', terminalsRouter);
app.use('/nicknames', nicknamesRouter);
app.use('/services', servicesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
