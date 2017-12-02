const env = process.env.NODE_ENV || 'development';
const config = require('../../config/mongo')[env];

const mongoose = require('mongoose');
const mongooseeder = require('mongooseeder');
const models = require('../../models/mongoose');

const envUrl = process.env[config.use_env_variable];
const localUrl = `mongodb://${ config.host }/${ config.database }`;
const mongodbUrl =  envUrl ? envUrl : localUrl;

mongooseeder.seed({
  mongodbUrl: mongodbUrl,
  models: models,
  clean: true,
  mongoose: mongoose,
  seeds: () => {

    // Run your seeds here
    // Example:
    // return models.User.create({ email });
    return;
  }
});
