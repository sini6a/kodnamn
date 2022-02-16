var express = require('express');
var router = express.Router();

// var mongoose = require("mongoose");
var Terminal = require("../models/terminal");
var Service = require("../models/service");
const { body, validationResult } = require('express-validator');

/* GET last 10 services. */
router.get('/', isAuthenticated, async function(req, res, next) {
    // TODO
});

// create new service (get)
router.get('/create', isAuthenticated, isUnique, function(req, res, next) {
    // TODO: Delete this
})

// create new service (post)
router.post("/create", [body('terminal', 'Terminal är obligatoriskt').notEmpty()], isAuthenticated, async function(req, res, next){
    var { terminal, part, note } = req.body

    terminal = await Terminal.findById(terminal).exec();

    // fields
    var form = {
        terminal: terminal,
        part: part,
        note: note
    };

    let errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.render('terminals/' + terminal._id, {
        title: terminal.macAddress,
        authenticated: req.isAuthenticated(),
        service: null,
        errors,
        form,
      })
    } else {
      let service = new Service(form);
      service.terminal = terminal._id;

      try {
        service.save()
      } catch (e) {
        console.error(e);
        errors.push({msg: e});
        res.render('terminals/' + terminal._id, {
          title: terminal.macAddress,
          authenticated: req.isAuthenticated(),
          service: null,
          errors,
          form,
        })
      }

      req.flash('success', 'Servis har sparats!')
      res.redirect('/terminals/' + terminal._id);
    }
});

// TODO: Fix listing all codenames in managers/create form!

// // modify manager (get)
// router.get('/edit/:id', isAuthenticated, isOwner, async function(req, res, next) {
//   let id = req.params.id

//   try {
//     var manager = await Manager.findById(id).exec();
//   } catch (e) {
//     console.log(e);
//   }

//   try {
//     var codenames = await Codename.find({user: req.user.id, deleted: false, manager: manager._id}).sort({createdAt: -1}).exec();
//   } catch (e) {
//     console.log(e);
//   }

//   // fields
//   var form = {
//       name: manager.name,
//       contact: manager.contact,
//       note: manager.note
//   };

//   res.render('managers/create', {
//     title: 'Modifierar ' + manager.name,
//     authenticated: req.isAuthenticated(),
//     manager,
//     form,
//     codenames,
//   })
// })

// // modify manager (post)
// router.post("/edit/:id", [
//   body('name', 'Namn är obligatoriskt').notEmpty()
// ], isAuthenticated, isOwner, async function(req, res, next){
//     let { name, contact, note } = req.body
//     let id = req.params.id

//     try {
//       manager = await Manager.findById(id).exec();
//     } catch (e) {
//       console.log(e);
//     }

//     // fields
//     var form = {
//         name: name,
//         contact: contact,
//         note: note
//     };

//     let errors = validationResult(req);

//     if(!errors.isEmpty()) {
//       res.render('managers/create', {
//         title: 'Modifierar ' + manager.name,
//         authenticated: req.isAuthenticated(),
//         manager,
//         form,
//         errors
//       })
//     } else {
//       try {
//         await Manager.findByIdAndUpdate(id, form).exec();
//       } catch (e) {
//         console.error(e);
//         errors.push({msg: e});
//         res.render('managers/create', {
//           title: 'Modifierar ' + manager.name,
//           authenticated: req.isAuthenticated(),
//           manager,
//           form,
//           errors
//         })
//       }

//       req.flash('success', 'Agenten har modifierats!')
//       res.redirect('/managers');
//     }
// });

// delete service (get)
router.get('/delete/:id', isAuthenticated, isOwner, async function(req, res, next) {
  let id = req.params.id

  try {
    var service = await Service.findById(id).exec();
    var terminal = await Terminal.findById(service.terminal);
  } catch (e) {
    console.log(e);
  }

  try {
    service.delete();
  } catch (e) {
    console.log(e);
  }

  req.flash('success', 'Reparationen har raderats!')
  res.redirect('/terminals/' + terminal._id);
})

// TODO: check if manager exists

// check if user is owner of the data
async function isOwner(req, res, next){
  let service = await Service.findById(req.params.id).populate('terminal').exec();
  if(service.terminal.user == req.user.id){
    return next();
  }
  req.flash('error', 'You are not the owner of the data you are trying to access!')
  res.redirect('/terminal/' + service.terminal)
}

// check if manager is unique
async function isUnique(req, res, next){
  exists = await Manager.exists({user: req.user, name: req.query.name})
  if(!exists){
    return next();
  }
  req.flash('error', `${req.query.name} är redan registrerad!`)
  res.redirect("/managers/")
}

// check if user is logged in
function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/users/login");
}

module.exports = router;
