const mongoose = require('mongoose');
const bluebird = require('bluebird');


mongoose.Promise = bluebird;

const models = {};

// Load models and attach to models object here
models.Order = require('./order'); 


module.exports = models;





