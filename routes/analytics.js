var url = require('url');
const express = require('express');
let router = express.Router();
//var modelsSeq = require('./../models/sequelize');
// var Product = modelsSeq.Product;
// var Category = modelsSeq.Category;
// var sequelize = modelsSeq.sequelize;
var mongoose = require('mongoose');
var modelsMon = require('./../models/mongoose');
var Order = mongoose.model('Order');

router.get('/', (req, res) => {
  Order.aggregate(
    // Limit to relevant documents and potentially take advantage of an index
    { $match: {} },
    {
      $project: {
        _id: 0,
        total: { $sum: { $add: '$charge.amount' } }
      }
    }
  );
  res.render('analytics/index', {});
});

module.exports = router;
