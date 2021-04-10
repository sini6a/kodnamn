var express = require('express');
var router = express.Router();

// var mongoose = require("mongoose");
var Codename = require("../models/codename");
var Terminal = require("../models/terminal");
var Nickname = require("../models/nickname");
const { body, validationResult } = require('express-validator');

// create new codename (get)
router.get('/create/:codename', isAuthenticated, async function(req, res, next) {
  let { macAddress, nickname, motherboard, processor, graphics, ram, teamviewer } = req.body

  let id = req.params.codename

  try {
    var codename = await Codename.findById(id).exec();
    var nicknames = await Nickname.find({user: req.user}).exec();
  } catch (e) {
    console.error(e);
  }

  // fields
  var form = {
      codename: codename.name,
      macAddress: req.query.macAddress,
      nickname: nickname,
      motherboard: motherboard,
      processor: processor,
      ram: ram,
      graphics: graphics,
      teamviewer: teamviewer
  };

  res.render('terminals/create', {
    title: "Register terminal",
    authenticated: req.isAuthenticated(),
    form,
    codename,
    nicknames
  })
})

// create new terminal (post)
router.post("/create/:codename", [
  body('macAddress', 'MAC address is required').notEmpty(),
  body('nickname', 'Nickname is required').notEmpty()
], isAuthenticated, async function(req, res, next){
    let { macAddress, nickname, motherboard, processor, graphics, ram, teamviewer } = req.body
    let id = req.params.codename

    try {
      var codename = await Codename.findById(id).exec();
      var nicknames = await Nickname.find({user: req.user}).exec();
    } catch (e) {
      console.error(e);
    }

    // fields
    var form = {
        codename: codename.name,
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
        title: "Register terminal",
        authenticated: req.isAuthenticated(),
        errors,
        form,
        codename,
        nicknames
      })
    } else {
      let terminal = new Terminal(form);
      terminal.codename = codename;
      terminal.nickname = await Nickname.findById(nickname).exec();

      try {
        terminal.save()
      } catch (e) {
        console.error(e);
        errors.push({msg: e});
        res.render('terminals/create', {
          title: "Register terminal",
          authenticated: req.isAuthenticated(),
          errors,
          form,
          codename,
          nicknames
        })
      }

      req.flash('success', 'Terminal successfully created!')
      res.redirect('/codenames/' + codename.id);
    }
});

// modify terminal (get)
router.get('/edit/:id', isAuthenticated, async function(req, res, next) {
  let id = req.params.id

  try {
    terminal = await Terminal.findById(id).populate('codename').exec();
    nicknames = await Nickname.find({user: req.user}).exec();
  } catch (e) {
    console.log(e);
  }

  // fields
  var form = {
      codename: terminal.codename.name,
      macAddress: terminal.macAddress,
      nickname: terminal.nickname,
      motherboard: terminal.motherboard,
      processor: terminal.processor,
      ram: terminal.ram,
      graphics: terminal.graphics,
      teamviewer: terminal.teamviewer
  };

  res.render('terminals/create', {
    title: 'Modifying ' + terminal.macAddress,
    authenticated: req.isAuthenticated(),
    form,
    nicknames
  })
})

// modify terminal (post)
router.post("/edit/:id", [
  body('macAddress', 'MAC address is required').notEmpty(),
  body('nickname', 'Nickname is required').notEmpty()
], isAuthenticated, async function(req, res, next){
    let { macAddress, nickname, motherboard, processor, graphics, ram, teamviewer } = req.body
    let id = req.params.id

    try {
      terminal = await Terminal.findById(id).populate('codename').exec();
      nicknames = await Nickname.find({user: req.user}).exec();
    } catch (e) {
      console.error(e);
    }

    // fields
    var form = {
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
        title: 'Modifying ' + terminal.macAddress,
        authenticated: req.isAuthenticated(),
        errors,
        form,
        nicknames
      })
    } else {
      try {
        terminal = await Terminal.findByIdAndUpdate(id, form).exec();
      } catch (e) {
        console.error(e);
        errors.push({msg: e});
        res.render('terminals/create', {
          title: 'Modifying ' + terminal.macAddress,
          authenticated: req.isAuthenticated(),
          errors,
          form,
          nicknames
        })
      }

      req.flash('success', 'Terminal successfully modified!')
      res.redirect('/codenames/' + terminal.codename);
    }
});

// delete terminal (post)
router.post('/delete/:id', isAuthenticated, async function(req, res, next) {
  let id = req.params.id
  let errors = new Object()

  try {
    terminal = await Terminal.findById(id).exec();
    codename = terminal.codename;
    await terminal.delete();
  } catch (e) {
    console.log(e);
  }

  req.flash('success', 'Terminal successfully deleted!')
  res.redirect('/codenames/' + codename._id);
})

// show terminal (get)
router.get('/:id', isAuthenticated, async function(req, res, next) {
  let id = req.params.id

  let errors = new Object()

  try {
    terminal = await Terminal.findById(id).populate('codename').populate('nickname').exec();
  } catch (e) {
    console.log(e);
  }

  res.render('terminals/show', {
    title: terminal.macAddress,
    authenticated: req.isAuthenticated(),
    terminal,
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