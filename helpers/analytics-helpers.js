const mongoose = require('mongoose');
const models = require('./../models/mongoose');
const Order = mongoose.model('Order');
const sqlmodels = require('./../models/sequelize');
const Product = sqlmodels.Product;
const Category = sqlmodels.Category;

const _getRevenueByCategory = () => {
  return Order.aggregate([
    {$unwind: "$orderLine"},
    {$group: {
      _id: "$orderLine.product.category",
      total: {$sum: {$multiply: ["$orderLine.product.quantity", "$orderLine.product.price"]}}
    }}
  ]);
}

const _getRevenueByState = () => {
  return Order.aggregate([
    {$group: {
      _id: "$address.state",
      total: {$sum: "$revenue"}
    }}
  ]);
}

const _getRevenueByProduct = () => {
  return Order.aggregate([
    {$unwind: "$orderLine"},
    {$group: {
      _id: "$orderLine.product.name",
      total: {$sum: {$multiply: ["$orderLine.product.quantity", "$orderLine.product.price"]}}
    }}
  ]);
}

const _getTotalUnitsSold = () => {
  return Order.aggregate([
    {$unwind: "$orderLine"},
    {$group: {
      _id: null,
      count: {$sum: "$orderLine.product.quantity"}
    }}
  ]);
}

const _getTransactions = () => {
  return Order.count();
};

const _getDistinctCustomers = () => {
  return Order.distinct('customer.email').count();
};

const _getDistinctStates = () => {
  return Order.distinct('address.state').count();
};

const _getTotalCategories = () => {
  return Category.count();
};

const _getTotalProducts = () => {
  return Product.count();
};

const _getRevenue = () => {
  return Order.aggregate([
    {$match: {}}, 
    {$group: { _id: null, amount: { $sum: "$revenue" } } }
  ]);
};

const getAllAnalytics = async () => {
  let data = {};
  data.totalRevenue = (await _getRevenue())[0];
  data.totalProducts = await _getTotalProducts();
  data.totalCategories = await _getTotalCategories();
  data.totalStatesSoldTo = await _getDistinctStates();
  data.totalCustomersSoldTo = await _getDistinctCustomers();
  data.totalTransactions = await _getTransactions();
  data.totalUnitsSold = (await _getTotalUnitsSold())[0].count;
  data.revenueByProduct = await _getRevenueByProduct();
  data.revenueByState = await _getRevenueByState();
  data.revenueByCategory = await _getRevenueByCategory();
  return data;
};

module.exports = {
  getAllAnalytics
};