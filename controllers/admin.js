const express = require('express');
const mongoose = require('mongoose');
// const models = require('./../models/sequelize');
const models = require('./../models/mongoose');
// const { calculateCart, checkCartContent } = require('./../helpers/cart_helper');

const router = express.Router();
// const sequelize = models.sequelize;
// const Product = models.Product;
// const State = models.State;
const Order = mongoose.model('Order');
// const { STRIPE_SK, STRIPE_PK } = process.env;
// const stripe = require('stripe')(STRIPE_SK);

router.get('/orders', (req, res) => {
  Order.find().then(orders => {
    res.render('admin/index', { orders });
  });
});

router.get('/orders/:id', (req, res) => {
  Order.findById(req.params.id).then(order => {
    // console.dir(order.orderItems, { colors: true, depth: 3 });
    // console.log(order.orderItems);
    res.render('admin/show', { order });
  });
});

module.exports = router;
