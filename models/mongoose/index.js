var mongoose = require("mongoose");
var bluebird = require("bluebird");

// Set bluebird as the promise
// library for mongoose
mongoose.Promise = bluebird;

var models = {};

models.Admin = require("./admin");

// Load models and attach to models here
//models.User = require('./user');
//... more models

module.exports = models;
