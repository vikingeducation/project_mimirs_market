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

// analytics summary view
module.exports.analytics = function(req, res, next) {

  Promise.all(_getPromises())
    .then(results => {
      let queryResults = _prepResults(results);

      res.render('admin/analytics', {
        title: "Minmir's Market Analytics",
        totals: queryResults.totals,
        revenueByState: queryResults.revenueByState,
        revenueByProduct: queryResults.revenueByProduct,
        revenueByCategory: queryResults.revenueByCategory
      });

    })
    .catch((e) => res.status(500)
      .send(e.stack));


};

// collect all the data query promises
var _getPromises = function() {
  let promises = [];

  promises.push(Product.count({}));
  promises.push(Category.count({}));
  promises.push(Transaction.uniqueCustomers());
  promises.push(Transaction.totalUnits());
  promises.push(Transaction.totalRevenue());
  promises.push(Transaction.count());
  promises.push(Transaction.uniqueStates());
  promises.push(Transaction.revenueByState());
  promises.push(Transaction.revenueByProduct());
  promises.push(Transaction.revenueByCategory());

  return promises;
};

var _prepResults = function(results) {
  let totalsObj = {};

  let resultsObj = {};

  totalsObj.product = results[0];
  totalsObj.category = results[1];
  totalsObj.customers = results[2].length;
  totalsObj.unitsSold = results[3][0].value;
  totalsObj.totalRevenue = results[4][0].value;
  totalsObj.totalOrders = results[5];
  totalsObj.statesSoldTo = results[6].length;
  resultsObj.totals = totalsObj;

  resultsObj.revenueByState = results[7];

  resultsObj.revenueByProduct = results[8];

  resultsObj.revenueByCategory = results[9];

  return resultsObj;

};
