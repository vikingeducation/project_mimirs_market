const path = require("path");

const config = {
  config: "./config/sequelize",
  "migrations-path": "./migrations/sequelize",
  "seeders-path": "./seeds/sequelize",
  "models-path": "./models/sequelize"
};

Object.keys(config).forEach(key => {
  config[key] = path.resolve(config[key]);
});

module.exports = config;
