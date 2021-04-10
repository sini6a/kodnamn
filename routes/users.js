var express = require('express');
var router = express.Router();

// var mongoose                = require("mongoose");
var passport = require("passport");
var User = require("../models/user");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// get user login
router.get("/login", function(req, res, next){
  console.log(req.params);
  if (!req.user) {
    res.render('users/login', {
      title: 'Login'
    });
  } else {
    res.redirect("/codenames");
  }
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/codenames",
    successFlash: { type: 'success', message: 'You have successfully logged in.' },
    failureRedirect: "/users/login",
    failureFlash: { type: 'error', message: 'Invalid username or password.' }
}));

router.get("/register", function(req, res, next){
  if (!req.user) {
    res.render('users/register', {
      title: "Register",
    });
  } else {
    req.flash('error', 'You are already logged in!')
    res.redirect("/codenames");
  }
});

// signup
router.post("/register", function(req, res, next){
    // console.log(req.body.username);
    // console.log(req.body.password);
    let user = new User({username: req.body.username, email: req.body.email});
    let password = req.body.password;

    User.register(user, password, function(err, user){
        if(err){
            console.log(err);
            req.flash('error','Please check errors below!');
            return res.render('users/register', {
              title: "Register",
            });
        }
        passport.authenticate("local")(req, res, function(){
            req.flash('success','You have successfully registered!');
            res.redirect('/codenames');
        });
    });
});

// logout
router.get("/logout", isAuthenticated, function(req, res, next){
    req.logout();
    req.flash('success','You have successfully logged out!');
    res.redirect("/users/login");
});

// check if user is logged in
function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/users/login");
}

module.exports = router;
