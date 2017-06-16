var models = require('./../models/sequelize');
var sequelize = models.sequelize;
var Product = models.Product;
var Category = models.Category;
var US = require('us');

var mongoose = require('mongoose');
var models = require('./../models/mongoose');
var env = process.env.NODE_ENV || 'development';
var config = require('./../config/mongo')[env];
var Transaction = mongoose.model('Transaction');


// generates a summary list of orders
module.exports.orderList = function(req, res, next) {
  Transaction.find({})
    .then((transactions) => {


      res.render('admin/orders', {
        title: "Minmir's Market Analytics",
        transactions: transactions
      });
    })


};
