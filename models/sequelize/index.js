'use strict';

var mongoose = require('mongoose');
var bluebird = require('bluebird');

// Set bluebird as the promise
// library for mongoose
mongoose.Promise = bluebird;

var models = {};

// Load models and attach to models here
models.Category = require('./category');
models.Product = require('./product');
//... more models

module.exports = models;
