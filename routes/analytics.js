var url = require('url');
const express = require('express');
let router = express.Router();
var modelsSeq = require('./../models/sequelize');
var Product = modelsSeq.Product;
var Category = modelsSeq.Category;
var sequelize = modelsSeq.sequelize;
var mongoose = require('mongoose');
var modelsMon = require('./../models/mongoose');
var Order = mongoose.model('Order');

router.get('/', (req, res) => {
  let totals = Order.aggregate(
    // Limit to relevant documents and potentially take advantage of an index
    [
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$charge.amount' },
          totalUnitsEver: { $sum: '$totalUnits' },
          totalTransaction: { $sum: 1 }
        }
      }
    ]
  );

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
  Promise.all(promiseArr).then(result => {
    console.log('RESULT', result);

    res.render('analytics/index', {});
  });
});

module.exports = router;
