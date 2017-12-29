let mongoose = require('mongoose');
let bluebird = require('bluebird');
mongoose.Promise = bluebird;
let env = process.env.NODE_ENV || 'development';
let config = require('./config/mongo')[env];

module.exports = () => {
  let envUrl = process.env[config.use_env_variable];
  let localUrl = `mongodb://${config.host}/${config.database}`;
  let mongoUrl = envUrl ? envUrl : localUrl;
  console.log(mongoUrl);
  return mongoose.connect(mongoUrl, {
    useMongoClient: true,
  });
};
