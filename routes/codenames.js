var express = require('express');
var router = express.Router();

// var mongoose = require("mongoose");
var Codename = require("../models/codename");
var Manager = require("../models/manager");
var Customer = require("../models/customer");
var Terminal = require("../models/terminal");
const { body, validationResult } = require('express-validator');

/* GET codenames listing. */
router.get('/', isAuthenticated, async function(req, res, next) {
  let errors = new Object()
  let codenames = await Codename.find({user: req.user.id}).sort({createdAt: -1}).exec();

  res.render('codenames/index', {
    title: "Codenames",
    authenticated: req.isAuthenticated(),
    codenames: codenames,
    errors
  })
});

// create new codename (get)
router.get('/create/', isAuthenticated, async function(req, res, next) {
  let { name, location, address, manager, customer } = req.body

  // fields
  var form = {
      name: req.query.name,
      location: location,
      address: address,
      manager: manager,
      customer: customer
  };
  let errors = new Object()
  let managers = await Manager.find({user: req.user._id}).exec()
  let customers = await Customer.find({user: req.user._id}).exec()

  // let managers = Manager.find('user', req.user._id);
  console.log(managers);

  res.render('codenames/create', {
    title: "Register codename",
    authenticated: req.isAuthenticated(),
    errors,
    form,
    managers,
    customers
  })
})

// create new codename (post)
router.post("/create", [
  body('name', 'Codename is required').notEmpty(),
  body('location', 'Location is required').notEmpty(),
  body('address', 'Address is required').notEmpty(),
  body('manager', 'Manager is required').notEmpty(),
  body('customer', 'Customer is required').notEmpty()
], isAuthenticated, async function(req, res, next){
    let { name, location, address, manager, customer } = req.body

    try {
      managers = await Manager.find({user: req.user._id}).exec()
      customers = await Customer.find({user: req.user._id}).exec()
    } catch (e) {
      console.error(e);
    }

    // fields
    var form = {
        name: name,
        location: location,
        address: address,
        manager: manager,
        customer: customer
    };

    let errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.render('codenames/create', {
        title: "Register codename",
        authenticated: req.isAuthenticated(),
        errors,
        form,
        managers,
        customers
      })
    } else {
      let codename = new Codename(form);
      codename.user = req.user._id;

      try {
        codename.save()
      } catch (e) {
        console.error(e);
        errors.push({msg: e});
        res.render('codenames/create', {
          title: "Register codename",
          authenticated: req.isAuthenticated(),
          errors,
          form,
          managers,
          customers
        })
      }

      req.flash('success', 'Codename successfully created!')
      res.redirect('/codenames');
    }
});

// modify codename (get)
router.get('/edit/:id', isAuthenticated, async function(req, res, next) {
  let id = req.params.id

  try {
    codename = await Codename.findById(id).exec();
    managers = await Manager.find({user: req.user._id}).exec()
    customers = await Customer.find({user: req.user._id}).exec()
  } catch (e) {
    console.log(e);
  }

  // fields
  var form = {
      name: codename.name,
      location: codename.location,
      address: codename.address,
      manager: codename.manager,
      customer: codename.customer
  };

  res.render('codenames/create', {
    title: "Modifying " + codename.name,
    authenticated: req.isAuthenticated(),
    form,
    managers,
    customers
  })
})

// modify codename (post)
router.post("/edit/:id", [
  body('name', 'Codename is required').notEmpty(),
  body('location', 'Location is required').notEmpty(),
  body('address', 'Address is required').notEmpty(),
  body('manager', 'Manager is required').notEmpty(),
  body('customer', 'Customer is required').notEmpty()
], isAuthenticated, async function(req, res, next){
    let { name, location, address, manager, customer } = req.body
    let id = req.params.id

    try {
      codename = await Codename.findById(id).exec();
      managers = await Manager.find({user: req.user._id}).exec()
      customers = await Customer.find({user: req.user._id}).exec()
    } catch (e) {
      console.error(e);
    }

    // fields
    var form = {
        name: name,
        location: location,
        address: address,
        manager: manager,
        customer: customer
    };

    let errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.render('codenames/create', {
        title: "Modifying " + codename.name,
        authenticated: req.isAuthenticated(),
        errors,
        form,
        managers,
        customers
      })
    } else {
      try {
        codename = await Codename.findByIdAndUpdate(id, form);
      } catch (e) {
        console.error(e);
        errors.push({msg: e});
        res.render('codenames/create', {
          title: "Modifying " + codename.name,
          authenticated: req.isAuthenticated(),
          errors,
          form,
          managers,
          customers
        })
      }

      req.flash('success', 'Codename successfully modified!')
      res.redirect('/codenames/' + codename.id);
    }
});

// All Time Low & Blackbear - Monsters
// delete codename (post)
router.post('/delete/:id', isAuthenticated, async function(req, res, next) {
  let id = req.params.id

  try {
    await Codename.findById(id, function(err, codename) {
      codename.remove();
    }).exec();
  } catch (e) {
    console.log(e);
  }

  req.flash('success', 'Codename successfully deleted!')
  res.redirect('/codenames');
})

// show codename (get)
router.get('/:id', isAuthenticated, async function(req, res, next) {
  let id = req.params.id

  let errors = new Object()

  try {
    var codename = await Codename.findById(id).exec();
    var customer = await Customer.findById(codename.customer).exec();
    var manager = await Manager.findById(codename.manager).exec();
    var terminals = await Terminal.find({codename: codename.id}).populate('nickname').exec();
  } catch (e) {
    console.log(e);
  }

  console.log(terminals);

  res.render('codenames/show', {
    title: codename.name,
    authenticated: req.isAuthenticated(),
    codename,
    customer,
    manager,
    terminals,
    errors
  })
});

// check if user is logged in
function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/users/login");
}

module.exports = router;
