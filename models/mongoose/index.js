const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
module.exports = {
  User: require("./User"),
  Product: require("./Product"),
  Order: require("./Order.js"),
  Item: require("./Item")
};
