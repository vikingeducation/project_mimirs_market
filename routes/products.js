var express = require('express');
var router = express.Router();
var models = require('./../models/sequelize');
var sequelize = models.sequelize;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: "Mimir's Market"
  });
});


module.exports = router;
