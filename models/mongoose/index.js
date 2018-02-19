let mongoose = require('mongoose');
let bluebird = require('bluebird');

mongoose.Promsie = bluebird;

let models = {};

models.Order = require('./order');

module.exports = models;
