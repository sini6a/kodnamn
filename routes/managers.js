var express = require('express');
var router = express.Router();

// var mongoose = require("mongoose");
var Codename = require("../models/codename");
var Manager = require("../models/manager");
const { body, validationResult } = require('express-validator');

/* GET managers listing. */
router.get('/', isAuthenticated, async function(req, res, next) {
  let managers = await Manager.find({user: req.user.id}).exec();

  res.render('managers/index', {
    title: "Agenter",
    authenticated: req.isAuthenticated(),
    managers: managers,
  })
});

// create new codename (get)
router.get('/create', isAuthenticated, function(req, res, next) {
  let { name, contact, note } = req.body

  // fields
  var form = {
      name: req.query.name,
      contact: contact,
      note: note
  };

  res.render('managers/create', {
    title: "Registrera ny agent",
    authenticated: req.isAuthenticated(),
    manager: null,
    form,
  })
})

// create new manager (post)
router.post("/create", [body('name', 'Namn är obligatoriskt').notEmpty()], isAuthenticated, async function(req, res, next){
    let { name, contact, note } = req.body

    // fields
    var form = {
        name: name,
        contact: contact,
        note: note
    };

    let errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.render('managers/create', {
        title: "Registrera ny agent",
        authenticated: req.isAuthenticated(),
        manager: null,
        errors,
        form,
      })
    } else {
      let manager = new Manager(form);
      manager.user = req.user._id;

      try {
        manager.save()
      } catch (e) {
        console.error(e);
        errors.push({msg: e});
        res.render('managers/create', {
          title: "Registrera ny agent",
          authenticated: req.isAuthenticated(),
          manager: null,
          errors,
          form,
        })
      }

      req.flash('success', 'Agenten har registrerats!')
      res.redirect('/managers');
    }
});

// modify manager (get)
router.get('/edit/:id', isAuthenticated, async function(req, res, next) {
  let id = req.params.id

  try {
    manager = await Manager.findById(id).exec();
  } catch (e) {
    console.log(e);
  }

  // fields
  var form = {
      name: manager.name,
      contact: manager.contact,
      note: manager.note
  };

  res.render('managers/create', {
    title: 'Modifierar ' + manager.name,
    authenticated: req.isAuthenticated(),
    manager,
    form,
  })
})

// modify manager (post)
router.post("/edit/:id", [
  body('name', 'Namn är obligatoriskt').notEmpty()
], isAuthenticated, async function(req, res, next){
    let { name, contact, note } = req.body
    let id = req.params.id

    try {
      manager = await Manager.findById(id).exec();
    } catch (e) {
      console.log(e);
    }

    // fields
    var form = {
        name: name,
        contact: contact,
        note: note
    };

    let errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.render('managers/create', {
        title: 'Modifierar ' + manager.name,
        authenticated: req.isAuthenticated(),
        manager,
        form,
        errors
      })
    } else {
      try {
        await Manager.findByIdAndUpdate(id, form).exec();
      } catch (e) {
        console.error(e);
        errors.push({msg: e});
        res.render('managers/create', {
          title: 'Modifierar ' + manager.name,
          authenticated: req.isAuthenticated(),
          manager,
          form,
          errors
        })
      }

      req.flash('success', 'Agenten har modifierats!')
      res.redirect('/managers');
    }
});

// delete codename (post)
router.post('/delete/:id', isAuthenticated, async function(req, res, next) {
  let id = req.params.id

  try {
    await Manager.findById(id, function(err, manager) {
      manager.remove();
    }).exec();
  } catch (e) {
    console.log(e);
  }

  req.flash('success', 'Agenten har raderats!')
  res.redirect('/managers');
})

// check if user is logged in
function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/users/login");
}

module.exports = router;
