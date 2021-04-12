var express = require('express');
var router = express.Router();

var User = require("../models/user");
var Terminal = require("../models/terminal");
var Codename = require("../models/codename");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Kodnamn',
    authenticated: req.isAuthenticated()
  });
});

router.get('/search', isAuthenticated, async function(req, res, next) {
  keyword = req.query.keyword.trim()

  if(keyword === '') {
    res.redirect('/codenames');
  }

  try {
    codenames = await Codename.find({name: {$regex: keyword, $options: "i" }}).find({user: req.user}).exec();
    // TODO: We must have user related search in order to hide terminals that user not owns.
    // terminals = await Terminal.find({macAddress: {$regex: keyword, $options: "i" }}).exec();
  } catch (e) {
    console.error(e);
  } finally {
    res.render('result', {
      title: 'Sökresultat för: ' + keyword,
      authenticated: req.isAuthenticated(),
      codenames
    });
  }
})

// check if user is logged in
function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/users/login");
}


module.exports = router;
