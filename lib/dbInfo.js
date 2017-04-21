var modelsSeq = require("./../models/sequelize");
var Product = modelsSeq.Product;
var Category = modelsSeq.Category;
var sequelize = modelsSeq.sequelize;
var mongoose = require("mongoose");
var modelsMon = require("./../models/mongoose");
var Order = mongoose.model("Order");
var OrderedProduct = mongoose.model("OrderedProduct");

_totalRevUnTran = () => {
  return Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$total" },
        totalUnitsEver: { $sum: "$totalUnits" },
        totalTransactions: { $sum: 1 }
      }
    }
  ]);
};

_usersTotal = () => {
  return Order.aggregate([
    { $group: { _id: "$email" } },
    { $group: { _id: 1, totalUsers: { $sum: 1 } } }
  ]);
};

_productTotal = () => {
  return Product.count({});
};

_categoryTotal = () => {
  return Category.count({});
};

_statesTotal = () => {
  return Order.aggregate([
    { $group: { _id: "$state" } },
    { $group: { _id: "$state", totalStates: { $sum: 1 } } }
  ]);
};

_statesRevenue = () => {
  return Order.aggregate([
    {
      $group: { _id: "$state", revenueForState: { $sum: "$total" } }
    },
    { $sort: { revenueForState: -1 } },
    { $limit: 7 }
  ]);
};

_revenueByCategory = () => {
  return OrderedProduct.aggregate([
    {
      $group: {
        _id: "$Category.name",
        revenueForCategory: { $sum: { $multiply: ["$price", "$quantity"] } }
      }
    },
    { $sort: { revenueForCategory: -1 } },
    { $limit: 10 }
  ]);
};

_revenueByProduct = () => {
  return OrderedProduct.aggregate([
    {
      $group: {
        _id: "$name",
        revenueForProduct: { $sum: { $multiply: ["$price", "$quantity"] } }
      }
    },
    { $sort: { revenueForProduct: -1 } },
    { $limit: 10 }
  ]);
};

var getDbInfo = () => {
  return [
    _totalRevUnTran(),
    _usersTotal(),
    _productTotal(),
    _categoryTotal(),
    _statesTotal(),
    _statesRevenue(),
    _revenueByCategory(),
    _revenueByProduct()
  ];
};

module.exports = getDbInfo;
