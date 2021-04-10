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
    title: "Managers",
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
    title: "Register manager",
    authenticated: req.isAuthenticated(),
    form,
  })
})

// create new manager (post)
router.post("/create", [body('name', 'Manager name is required').notEmpty()], isAuthenticated, async function(req, res, next){
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
        title: "Register manager",
        authenticated: req.isAuthenticated(),
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
          title: "Register manager",
          authenticated: req.isAuthenticated(),
          errors,
          form,
        })
      }

      req.flash('success', 'Manager successfully created!')
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
    title: 'Modyfing ' + manager.name,
    authenticated: req.isAuthenticated(),
    form,
  })
})

// modify manager (post)
router.post("/edit/:id", [
  body('name', 'Manager name is required').notEmpty()
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
        title: 'Modyfing ' + manager.name,
        authenticated: req.isAuthenticated(),
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
          title: 'Modyfing ' + manager.name,
          authenticated: req.isAuthenticated(),
          form,
          errors
        })
      }

      req.flash('success', 'Manager successfully modified!')
      res.redirect('/managers');
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
