const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;

const models = {};

models.Order = require('./order');

module.exports = models;
