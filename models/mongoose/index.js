var mongoose = require('mongoose');
var bluebird = require('bluebird');


mongoose.Promise = bluebird;


var models = {};

models.Cart = require('./cart');

module.exports = models;
