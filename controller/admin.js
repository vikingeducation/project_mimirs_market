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
    .catch((e) => res.status(500)
      .send(e.stack));
};

// show a single order
module.exports.order = function(req, res, next) {
  Transaction.findById(req.params.orderID)
    .then((transaction) => {
      res.render('admin/order', {
        title: "Minmir's Market Analytics",
        transaction: transaction
      });
    })
    .catch((e) => res.status(500)
      .send(e.stack));
};
