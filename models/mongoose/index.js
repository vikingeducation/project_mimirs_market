const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;

const models = {};

models.Transaction = require('./transaction');

module.exports = models;
