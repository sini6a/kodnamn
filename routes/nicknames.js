var express = require('express');
var router = express.Router();

var Nickname = require("../models/nickname");
var Terminal = require("../models/terminal");
const { body, validationResult } = require('express-validator');

/* GET codenames listing. */
router.get('/', isAuthenticated, async function(req, res, next) {
  try {
    var nicknames = await Nickname.find({user: req.user.id}).sort({name:1}).exec();
  } catch (e) {
    console.error(e);
  }

  res.render('nicknames/index', {
    title: "Smeknamn",
    authenticated: req.isAuthenticated(),
    nicknames,
  })
});

// create new codename (post)
router.post("/", [
  body('name', 'Smeknamn är obligatoriskt').notEmpty()
], isAuthenticated, isUnique, async function(req, res, next){
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
        title: "Smeknamn",
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
          title: "Smeknamn",
          authenticated: req.isAuthenticated(),
          errors,
          form,
          nicknames
        })
      }

      req.flash('success', 'Smeknamnet har registrerats!')
      res.redirect('/nicknames');
    }
});

// modify nickname (get)
router.get('/edit/:id', isAuthenticated, isOwner, async function(req, res, next) {
  let id = req.params.id
  terminals = await Terminal.find({user: req.user.id, nickname: id}).populate('codename').exec();

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
    title: 'Modifierar ' + nickname.name,
    authenticated: req.isAuthenticated(),
    form,
    terminals: terminals,
  })
})

// modify manager (post)
router.post("/edit/:id", [
  body('name', 'Smeknamn är obligatoriskt').notEmpty()
], isAuthenticated, isOwner, async function(req, res, next){
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
        title: 'Modifierar ' + nickname.name,
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
          title: 'Modifierar ' + nickname.name,
          authenticated: req.isAuthenticated(),
          form,
          errors
        })
      }

      req.flash('success', 'Smeknamnet har modifierats!')
      res.redirect('/nicknames');
    }
});

// delete nickname (post)
router.post('/delete/:id', isAuthenticated, isOwner, async function(req, res, next) {
  let id = req.params.id

  try {
    await Nickname.findById(id, function(err, nickname) {
      nickname.remove();
    }).exec();
  } catch (e) {
    console.log(e);
  }

  req.flash('success', 'Smeknamn har raderats!')
  res.redirect('/nicknames');
})

// check if user is owner of the data
async function isOwner(req, res, next){
  nickname = await Nickname.findById(req.params.id).exec();
  if(nickname.user == req.user.id){
    return next();
  }
  req.flash('error', 'You are not the owner of the data you are trying to access!')
  res.redirect('/nicknames')
}

// check if manager is unique
async function isUnique(req, res, next){
  exists = await Nickname.exists({user: req.user, name: req.query.name})
  if(!exists){
    return next();
  }
  req.flash('error', `${req.query.name} är redan registrerad!`)
  res.redirect("/nicknames/")
}

// check if user is logged in
function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/users/login");
}

module.exports = router;
