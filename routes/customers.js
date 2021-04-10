var express = require('express');
var router = express.Router();

// var mongoose = require("mongoose");
var Customer = require("../models/customer");
const { body, validationResult } = require('express-validator');

// customers listing (get)
router.get('/', isAuthenticated, async function(req, res, next) {
  let customers = await Customer.find({user: req.user.id}).exec();

  res.render('customers/index', {
    title: "Customers",
    authenticated: req.isAuthenticated(),
    customers: customers,
  })
});

// create new customer (get)
router.get('/create', isAuthenticated, function(req, res, next) {
  let { name, contact, note } = req.body

  // fields
  var form = {
      name: req.query.name,
      contact: contact,
      note: note
  };

  res.render('customers/create', {
    title: "Register customer",
    authenticated: req.isAuthenticated(),
    form,
  })
})

// create new customer (post)
router.post("/create", [body('name', 'Customer name is required').notEmpty()], isAuthenticated, async function(req, res, next){
    let { name, contact, note } = req.body

    // fields
    var form = {
        name: name,
        contact: contact,
        note: note
    };

    let errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.render('customers/create', {
        title: "Register customer",
        authenticated: req.isAuthenticated(),
        errors,
        form,
      })
    } else {
      let customer = new Customer(form);
      customer.user = req.user._id;

      try {
        customer.save()
      } catch (e) {
        console.error(e);
        errors.push({msg: e});
        res.render('customers/create', {
          title: "Register customer",
          authenticated: req.isAuthenticated(),
          errors,
          form,
        })
      }

      req.flash('success', 'Customer successfully created!')
      res.redirect('/customers');
    }
});

// modify customer (get)
router.get('/edit/:id', isAuthenticated, async function(req, res, next) {
  let id = req.params.id

  try {
    customer = await Customer.findById(id).exec();
  } catch (e) {
    console.log(e);
  }

  // fields
  var form = {
      name: customer.name,
      contact: customer.contact,
      note: customer.note
  };

  res.render('customers/create', {
    title: 'Modifying ' + customer.name,
    authenticated: req.isAuthenticated(),
    form,
  })
})

// modify customer (post)
router.post("/edit/:id", [
  body('name', 'Customer name is required').notEmpty()
], isAuthenticated, async function(req, res, next){
    let { name, contact, note } = req.body
    let id = req.params.id

    try {
      customer = await Customer.findById(id).exec();
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
      res.render('customers/create', {
        title: 'Modifying ' + customer.name,
        authenticated: req.isAuthenticated(),
        form,
        errors
      })
    } else {
      try {
        await Customer.findByIdAndUpdate(id, form).exec();
      } catch (e) {
        console.error(e);
        errors.push({msg: e});
        res.render('customers/create', {
          title: 'Modifying ' + customer.name,
          authenticated: req.isAuthenticated(),
          form,
          errors
        })
      }

      req.flash('success', 'Customer successfully modified!')
      res.redirect('/customers');
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
