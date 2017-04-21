const sqlModels = require("./../models/sequelize");
const sequelize = sqlModels.sequelize;

const { Product, Category } = sqlModels;

const mongoose = require("mongoose");
const mongoModels = require("./../models/mongoose");

const Order = mongoose.model("Order");


let analytics = {};

analytics.totals = () => {
  return Order.aggregate([
    {
      $group: {
        _id: null,
        revenue: { $sum: "$revenue" },
        quantity: { $sum: "$quantity" },
        transactions: { $sum: 1 }
      }
    },
    { $project: { _id: 0 } }
  ]);
};

analytics.productCount = () => {
  return Product.count();
};

analytics.categoryCount = () => {
  return Category.count();
}

analytics.customerCount = () => {
  return Order.distinct('email').count();
}

analytics.stateCount = () => {
  return Order.distinct('state').count();
}

module.exports = analytics;
