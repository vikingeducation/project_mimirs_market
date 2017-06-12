const config = {
  "development": {
    "username": process.env.POSTGRES_USERNAME,
    "password": process.env.POSTGRES_PASSWORD,
    "database": "project_mimirs_market_development",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "test": {
    "username": "christian",
    "password": null,
    "database": "project_mimirs_market_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres"
  }
};


module.exports = config;