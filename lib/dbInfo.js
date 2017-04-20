var modelsSeq = require('./../models/sequelize');
var Product = modelsSeq.Product;
var Category = modelsSeq.Category;
var sequelize = modelsSeq.sequelize;
var mongoose = require('mongoose');
var modelsMon = require('./../models/mongoose');
var Order = mongoose.model('Order');

var dbInfo = {};

dbInfo.getTotals = function() {
  let totals = Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$charge.amount' },
        totalUnitsEver: { $sum: '$totalUnits' },
        totalTransactions: { $sum: 1 }
      }
    }
  ]);

  let usersTotal = Order.aggregate(
    { $group: { _id: '$email' } },
    { $group: { _id: 1, totalUsers: { $sum: 1 } } },
    { $project: { _id: 0 } }
  );

  let productTotal = Product.count({});

  let categoryTotal = Category.count({});

  let statesTotal = Order.aggregate(
    { $group: { _id: '$state' } },
    { $group: { _id: 1, totalStates: { $sum: 1 } } },
    { $project: { _id: 0 } }
  );

  let promiseArr = [
    totals,
    usersTotal,
    productTotal,
    categoryTotal,
    statesTotal
  ];
  return promiseArr;
};

dbInfo.statesRevenue = function() {
  let byState = Order.aggregate([
    {
      $group: { _id: '$state', revenueForState: { $sum: '$charge.amount' } }
    }
  ]);
  return byState;
};

dbInfo.revenueByCategory = function() {
  let byCategory = Order.aggregate([
    {
      //
    }
  ]);
};

module.exports = dbInfo;
