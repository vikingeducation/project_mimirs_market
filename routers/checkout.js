const express = require('express');
const app = express();
const router = express.Router();
const {
  Product,
  sequelize,
  Category,
  Sequelize: {Op},
} = require('../models/sequelize');
const h = require('../helpers');
var {STRIPE_SK, STRIPE_PK} = process.env;
var stripe = require('stripe')(STRIPE_SK);
var mongoose = require('mongoose');
var models = require('./../models/mongoose');
var Order = mongoose.model('Order');

router.get('/', async (req, res, next) => {
  try {
    products = req.session.items;
    total = req.session.total;
    res.render('checkout/new', {products, total, STRIPE_PK});
  } catch (e) {
    next(e);
  }
});

router.post('/charges', async (req, res) => {
  let charge = req.body;
  let stripedata = stripe.charges
    .create({
      amount: req.session.total,
      currency: 'usd',
      description: 'test',
      source: charge.stripeToken,
    })
    .then((charge) => {
      // ... Save charge and session data
      // from checkout and cart
      // to MongoDB
      let order = new Order({
        fname: charge.fname,
        lname: charge.lname,
        street: charge.street,
        city: charge.city,
        // stripeToken: charge.stripeToken
        // stripeTokenType: charge.stripeTokenType,
        // stripeEmail: charge.stripeEmail,
        total: req.session.total,
        product: req.session.items,
      });
      order.save();
    })
    .then((result) => {
      // Order.findAll();
      res.redirect('/');
    })
    .catch(() => res.status(500).send(e.stack));
});

module.exports = router;
