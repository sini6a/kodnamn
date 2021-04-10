var express = require('express');
var router = express.Router();

var Nickname = require("../models/nickname");
const { body, validationResult } = require('express-validator');

/* GET codenames listing. */
router.get('/', isAuthenticated, async function(req, res, next) {
  let errors = new Object()

  try {
    var nicknames = await Nickname.find({user: req.user.id}).exec();
  } catch (e) {
    console.error(e);
  }

  res.render('nicknames/index', {
    title: "Nicknames",
    authenticated: req.isAuthenticated(),
    nicknames,
    errors
  })
});

// create new codename (post)
router.post("/", [
  body('name', 'Codename is required').notEmpty()
], isAuthenticated, async function(req, res, next){
    let { name } = req.body

    try {
      var nicknames = await Nickname.find({user: req.user.id}).exec();
    } catch (e) {
      console.error(e);
    }

    // fields
    var form = {
        name: name
    };

    let errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.render('nicknames/index', {
        title: "Nicknames",
        authenticated: req.isAuthenticated(),
        errors,
        form,
        nicknames
      })
    } else {

      // finish
      let nickname = new Nickname(form);
      nickname.user = req.user._id;

      try {
        nickname.save()
      } catch (e) {
        console.error(e);
        errors.push({msg: e});
        res.render('nicknames/index', {
          title: "Nicknames",
          authenticated: req.isAuthenticated(),
          errors,
          form,
          nicknames
        })
      }

      req.flash('success', 'Nickname successfully created!')
      res.redirect('/nicknames');
    }
});

// modify nickname (get)
router.get('/edit/:id', isAuthenticated, async function(req, res, next) {
  let id = req.params.id

  try {
    nickname = await Nickname.findById(id).populate('user').exec();
  } catch (e) {
    console.log(e);
  }

  // fields
  var form = {
      user: nickname.user,
      name: nickname.name
  };

  res.render('nicknames/create', {
    title: 'Modyfing ' + nickname.name,
    authenticated: req.isAuthenticated(),
    form,
  })
})

// modify manager (post)
router.post("/edit/:id", [
  body('name', 'Nickname is required').notEmpty()
], isAuthenticated, async function(req, res, next){
    let { name } = req.body
    let id = req.params.id

    try {
      nickname = await Nickname.findById(id).populate('user').exec();
    } catch (e) {
      console.log(e);
    }

    // fields
    var form = {
        user: nickname.user,
        name: name
    };

    let errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.render('nicknames/create', {
        title: 'Modyfing ' + nickname.name,
        authenticated: req.isAuthenticated(),
        form,
        errors
      })
    } else {
      try {
        nickname = await Nickname.findByIdAndUpdate(id, form).exec();
      } catch (e) {
        console.error(e);
        errors.push({msg: e});
        res.render('nicknames/create', {
          title: 'Modyfing ' + nickname.name,
          authenticated: req.isAuthenticated(),
          form,
          errors
        })
      }

      req.flash('success', 'Nickname successfully modified!')
      res.redirect('/nicknames');
    }
});

// check if user is logged in
function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/users/login");
}

module.exports = router;