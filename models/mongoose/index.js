var mongoose = require("mongoose");
var bluebird = require("bluebird");

// Set bluebird as the promise
// library for mongoose
mongoose.Promise = bluebird;

var models = {};

// Load models and attach to models here
models.Order = require("./order");
models.Charge = require("./charge");
models.OrderItem = require("./orderItem");

module.exports = models;
