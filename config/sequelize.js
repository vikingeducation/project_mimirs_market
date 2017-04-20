require('dotenv').config();
const username = process.env.PG_USERNAME;
const password = process.env.PG_PASSWORD;

module.exports = {
  "development": {
    "username": username,
    "password": password,
    "database": "project_mimirs_market_development",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": username,
    "password": password,
    "database": "project_mimirs_market_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
};
