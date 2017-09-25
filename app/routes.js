var express = require('express')
var router = express.Router()
var path = require('path')

router.get('*', function (req, res, next) {
  res.locals.debug = {};
  next();
})

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

// add your routes here

module.exports = router
