const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
module.exports = {
  Order: require("./Order.js"),
  Item: require("./Item")
};
