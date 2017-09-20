var mongoose = require('mongoose');
var bluebird = require('bluebird');

mongoose.Promise = bluebird;

var models = {};
models.OrderedProduct = require('./orderedProduct');
models.Order = require('./order');

// Load models and attach to models here
// models.User = require('./user');

module.exports = models;
