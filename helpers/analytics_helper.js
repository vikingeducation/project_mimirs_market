const mongoose = require('mongoose');
const models = require('./../models/sequelize');
const mongooseModels = require('./../models/mongoose');

const Product = models.Product;
const Category = models.Category;
const Order = mongoose.model('Order');

function _getTotalRevenue() {
  return Order.aggregate([
    {
      $group: {
        _id: null,
        sum: { $sum: '$revenue' }
      }
    }
  ]);
}

function _getTotalUnitsSold() {
  return Order.aggregate([
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: null,
        sum: { $sum: '$orderItems.product.quantity' }
      }
    }
  ]);
}

function _getTotalTransactions() {
  return Order.count();
}

function _getTotalCustomers() {
  return Order.distinct('user.email').count();
}

function _getTotalProducts() {
  return Product.count();
}

function _getTotalCategories() {
  return Category.count();
}

function _getTotalStatesSoldTo() {
  return Order.distinct('address.state').count();
}

function _getRevenueByProduct() {
  return Order.aggregate([
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product.name',
        revenue: {
          $sum: {
            $multiply: [
              '$orderItems.product.price',
              '$orderItems.product.quantity'
            ]
          }
        }
      }
    },
    { $sort: { revenue: -1 } }
  ]);
}

function _getRevenueByState() {
  return Order.aggregate([
    {
      $group: {
        _id: '$address.state',
        revenue: {
          $sum: '$revenue'
        }
      }
    },
    { $sort: { revenue: -1 } }
  ]);
}

function _getRevenueByCategory() {
  return Order.aggregate([
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.product.category',
        revenue: {
          $sum: {
            $multiply: [
              '$orderItems.product.price',
              '$orderItems.product.quantity'
            ]
          }
        }
      }
    },
    { $sort: { revenue: -1 } }
  ]);
}

async function getAllData() {
  let data = {};

  data.totalRevenue = (await _getTotalRevenue())[0];
  data.totalUnitsSold = (await _getTotalUnitsSold())[0];
  data.totalTransactions = await _getTotalTransactions();
  data.totalCustomers = await _getTotalCustomers();
  data.totalProducts = await _getTotalProducts();
  data.totalCategories = await _getTotalCategories();
  data.totalStatesSoldTo = await _getTotalStatesSoldTo();
  data.revenueByProduct = await _getRevenueByProduct();
  data.revenueByState = await _getRevenueByState();
  data.revenueByCategory = await _getRevenueByCategory();

  return data;
}

module.exports = { getAllData };
