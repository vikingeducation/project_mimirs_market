const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const models = require('./../models/mongoose');
const Order = mongoose.model('Order');
const sqlmodels = require('./../models/sequelize');
const Product = sqlmodels.Product;
const { getAllAnalytics } = require('./../helpers/analytics-helpers');

router.get('/', (req, res) => {
  getAllAnalytics()
    .then(data => {
      res.render('analytics/index', { data } );
    });
  // let totalRevenue;
  // Order.aggregate([
  //   {$match: {}}, 
  //   {$group: { _id: null, amount: { $sum: "$revenue" } } }
  // ])
  //   .then(results => {
  //     totalRevenue = results[0];
  //     console.log(JSON.stringify(results, null, 2));
  //     res.render('analytics/index', {
  //       totalRevenue
  //     });
  //   });
});

module.exports = router;