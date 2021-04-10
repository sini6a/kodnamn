var express = require('express');
var router = express.Router();

var User = require("../models/user");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Kodnamn',
    authenticated: req.isAuthenticated()
  });
});

module.exports = router;
