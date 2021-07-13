var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {page:'Home', menuId:'home'});
});

router.get('/instructions', function(req, res, next) {
  res.render('instructions', {page:'Instructions', menuId:'instructions'});
});

router.get('/register', function(req, res, next) {
  res.render('registerBike', {page:'Register Bike', menuId:'register'});
});

router.get('/management', function(req, res, next) {
  res.render('management', {page:'Management', menuId:'management'});
});

router.get('/about', function(req, res, next) {
  res.render('about', {page:'About', menuId:'about'});
});

module.exports = router;