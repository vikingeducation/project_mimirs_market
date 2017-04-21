const mongoose = require("mongoose");
const mongoModels = require("./../models/mongoose");
const Order = mongoose.model("Order");

let analytics = {};

analytics.totalRevenue = () => {
  Order.aggregate(
    { $group: { _id: null } }
  );
};

module.exports = analytics;
