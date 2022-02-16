var express = require('express');
var router = express.Router();

// var mongoose = require("mongoose");
var Codename = require("../models/codename");
var Terminal = require("../models/terminal");
var Nickname = require("../models/nickname");
var Service = require("../models/service");
const { body, validationResult } = require('express-validator');

// Location
var parts = require('../external_data/parts.json')

// index terminals (get)
router.get('/', isAuthenticated, async function(req, res, next) {
  try {
    unregisteredTerminals = await Terminal.find({user: req.user.id}).where("codename").eq(null).populate("nickname").exec();
    registeredTerminals = await Terminal.find({user: req.user.id}).where("codename").ne(null).populate("nickname").exec();
  } catch (e) {
    console.error(e);
  }

  res.render('terminals/index', {
    title: "Terminaler",
    authenticated: req.isAuthenticated(),
    unregisteredTerminals: unregisteredTerminals,
    registeredTerminals: registeredTerminals
  })
})

// create new terminal (get)
router.get('/create', isAuthenticated, isUnique, async function(req, res, next) {
  let { codename, macAddress, nickname, motherboard, processor, graphics, ram, teamviewer } = req.body

  console.log("Console log: " + req.query.codename)
  let id = req.query.codename
  macAddress = req.query.macAddress

  try {
    codename = await Codename.findById(id).exec();
    nicknames = await Nickname.find({user: req.user}).exec();
    codenames = await Codename.find({user: req.user, deleted: false}).exec();
  } catch (e) {
    console.error(e);
  }

  // fields
  var form = {
      codename: codename,
      macAddress: req.query.macAddress,
      nickname: nickname,
      motherboard: motherboard,
      processor: processor,
      ram: ram,
      graphics: graphics,
      teamviewer: teamviewer
  };

  res.render('terminals/create', {
    title: "Registrera ny terminal",
    authenticated: req.isAuthenticated(),
    terminal: null,
    form,
    codename,
    nicknames,
    codenames
  })
})

// create new terminal (post)
router.post("/create/", [
  body('codename', 'Kodnamn är obligatorisk').notEmpty(),
  body('macAddress', 'MAC adress är obligatorisk').notEmpty(),
  body('nickname', 'Smeknamn är obligatoriskt').notEmpty()
], isAuthenticated, isUnique, async function(req, res, next){
    let { codename, macAddress, nickname, motherboard, processor, graphics, ram, teamviewer } = req.body

    try {
      codename = await Codename.findById(codename).exec();
      nicknames = await Nickname.find({user: req.user}).exec();
    } catch (e) {
      console.error(e);
    }

    // fields
    var form = {
        codename: codename,
        macAddress: macAddress,
        nickname: nickname,
        motherboard: motherboard,
        processor: processor,
        ram: ram,
        graphics: graphics,
        teamviewer: teamviewer
    };

    let errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.render('terminals/create', {
        title: "Registrera ny terminal",
        authenticated: req.isAuthenticated(),
        terminal: null,
        errors,
        form,
        codename,
        nicknames
      })
    } else {
      let terminal = new Terminal(form);
      terminal.codename = codename;
      terminal.user = req.user;

      try {
        terminal.save()
      } catch (e) {
        console.error(e);
        errors.push({msg: e});
        res.render('terminals/create', {
          title: "Registrera ny terminal",
          authenticated: req.isAuthenticated(),
          terminal: null,
          errors,
          form,
          codename,
          nicknames
        })
      }

      req.flash('success', 'Terminalen har registrerats!')
      res.redirect('/codenames/' + codename.id);
    }
});

// modify terminal (get)
// TODO: Create middleware to check if codename exists or redirect to create codename
router.get('/edit/:id', isAuthenticated, isOwner, async function(req, res, next) {
  let id = req.params.id

  try {
    terminal = await Terminal.findById(id).populate('codename').exec();
    codenames = await Codename.find({user: req.user, deleted: false}).exec();
    nicknames = await Nickname.find({user: req.user}).exec();
  } catch (e) {
    console.log(e);
  }

  // fields
  var form = {
      codename: terminal.codename,
      macAddress: terminal.macAddress,
      nickname: terminal.nickname,
      motherboard: terminal.motherboard,
      processor: terminal.processor,
      ram: terminal.ram,
      graphics: terminal.graphics,
      teamviewer: terminal.teamviewer
  };

  res.render('terminals/create', {
    title: 'Modifierar ' + terminal.macAddress,
    authenticated: req.isAuthenticated(),
    terminal,
    form,
    nicknames,
    codenames
  })
})

// modify terminal (post)
router.post("/edit/:id", [
  body('codename', 'Kodnamn är obligatorisk').notEmpty(),
  body('macAddress', 'MAC adress är obligatorisk').notEmpty(),
  body('nickname', 'Smeknamn är obligatoriskt').notEmpty()
], isAuthenticated, isOwner, async function(req, res, next){
    let { codename, macAddress, nickname, motherboard, processor, graphics, ram, teamviewer } = req.body

    let id = req.params.id

    try {
      codename = await Codename.findById(codename).exec();
      codenames = await Codename.find({user: req.user, deleted: false}).exec();
      terminal = await Terminal.findById(id).populate('codename').exec();
      nicknames = await Nickname.find({user: req.user}).exec();
    } catch (e) {
      console.error(e);
    }

    // fields
    var form = {
        codename: codename,
        macAddress: macAddress,
        nickname: nickname,
        motherboard: motherboard,
        processor: processor,
        ram: ram,
        graphics: graphics,
        teamviewer: teamviewer
    };

    let errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.render('terminals/create', {
        title: 'Modifierar ' + terminal.macAddress,
        authenticated: req.isAuthenticated(),
        terminal,
        errors,
        form,
        nicknames,
        codenames
      })
    } else {
      try {
        terminal = await Terminal.findByIdAndUpdate(id, form).exec();
      } catch (e) {
        console.error(e);
        errors.push({msg: e});
        res.render('terminals/create', {
          title: 'Modifierar ' + terminal.macAddress,
          authenticated: req.isAuthenticated(),
          terminal,
          errors,
          form,
          nicknames,
          codenames
        })
      }

      req.flash('success', 'Terminalen har modifierats!')
      res.redirect('/codenames/' + codename.id);
    }
});

// delete terminal (post)
router.post('/delete/:id', isAuthenticated, isOwner, async function(req, res) {
  let id = req.params.id
  let errors = new Object()

  try {
    terminal = await Terminal.findById(id);
    if (terminal.codename == null) {
      terminal.deleteOne()
    } else {
      terminal.codename = null
    }
    await terminal.save();
  } catch (e) {
    console.log(e);
  }

  req.flash('success', 'Terminalen har raderats!')
  res.redirect('/terminals');
})

// show terminal (get)
router.get('/:id', isAuthenticated, isOwner, async function(req, res, next) {
  let id = req.params.id
  let { note } = req.body

  // fields
  var form = {
      parts: parts,
      note: note,
  };
  
  try {
    terminal = await Terminal.findById(id).populate('codename').populate('nickname').exec();
  } catch (e) {
    console.log(e);
  }

  try {
    services = await Service.find({terminal: terminal._id}).exec();
  } catch (e) {
    console.log(e);
  }

  res.render('terminals/show', {
    title: terminal.macAddress,
    authenticated: req.isAuthenticated(),
    terminal,
    parts,
    form,
    services
  })
});

// check if user is owner of the data
async function isOwner(req, res, next){
  terminal = await Terminal.findById(req.params.id).exec();
  if(terminal.user == req.user.id){
    return next();
  }
  req.flash('error', 'You are not the owner of the data you are trying to access!')
  res.redirect('/terminals')
}

// check if mac address of terminal is unique
async function isUnique(req, res, next){
  console.log(req.query.macAddress)
  exists = await Terminal.exists({user: req.user, macAddress: req.query.macAddress})
  if(!exists){
    return next();
  }
  req.flash('error', `${req.query.macAddress} är redan registrerad!`)
  res.redirect("/terminals/")
}

// check if user is logged in
function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/users/login");
}

module.exports = router;
