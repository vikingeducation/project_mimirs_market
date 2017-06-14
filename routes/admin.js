const express = require('express');
const router = express.Router();
const h = require('./../helpers/path-helpers').registered;
const mongoose = require('mongoose');
const models = require('./../models/mongoose');
const Order = mongoose.model('Order');


// ----------------------------------------
// Index
// ----------------------------------------
router.get('/', (req, res) => {
  Order.find({})
    .then(orders => {
      res.render('admin/index', { orders });
    });
});

// ----------------------------------------
// Individual Order
// ----------------------------------------
router.get('/:id', (req, res) => {
  Order.findById(req.params.id)
    .then(order => {
      console.log('#######')
      console.log(JSON.stringify(order, null, 2))
      console.log('#######')
      res.render('admin/show', { order });
    });
});

module.exports = router;