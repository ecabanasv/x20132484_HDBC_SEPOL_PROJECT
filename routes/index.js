var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {page:'Home', menuId:'home'});
});

router.get('/register', function(req, res, next) {
  res.render('registerBike', {page:'Register Bike', menuId:'register'});
});

router.get('/showdetails', function(req, res, next) {
  res.render('showDetails', {page:'Show details', menuId:'showdetails'});
});

router.get('/adddetails', function(req, res, next) {
  res.render('addDetails', {page:'Add details', menuId:'adddetails'});
});

router.get('/transferownership', function(req, res, next) {
  res.render('transferOwnership', {page:'Transfer Ownership', menuId:'transferownership'});
});

router.get('/renounceownership', function(req, res, next) {
  res.render('renounceOwnership', {page:'Renounce Ownership', menuId:'renounceownership'});
});

router.get('/faq', function(req, res, next) {
  res.render('faq', {page:'FAQ', menuId:'faq'});
});

router.get('/contact', function(req, res, next) {
  res.render('contact', {page:'Contact', menuId:'contact'});
});

module.exports = router;