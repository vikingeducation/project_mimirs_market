var mongoose = require('mongoose');
var bluebird = require('bluebird');


mongoose.Promise = bluebird;


var models = {};

models.Cart = require('./cart');
models.Product = require('./product');
models.Category = require('./category');

module.exports = models;
