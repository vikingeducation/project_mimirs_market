const mongoose = require("mongoose");
const mongooseeder = require("mongooseeder");
const models = require("./path/to/models");

const mongodbUrl = "mongodb://localhost/your_db";

mongooseeder.seed({
  mongodbUrl: mongodbUrl,
  models: models,
  clean: true,
  mongoose: mongoose,
  seeds: () => {
    // Run your seeds here
    // Example:
    return models.User.create({ email });
  }
});
