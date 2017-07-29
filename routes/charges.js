const express = require('express');
const router = express.Router();
const h = require('./../helpers/path-helpers').registered;
const mongoose = require('mongoose');
const models = require('./../models/mongoose');
const Order = mongoose.model('Order');
const {
  STRIPE_SK,
  STRIPE_PK
} = process.env;
const stripe = require('stripe')(STRIPE_SK);

router.post('/', (req, res) => {
  var orderInfo = req.body.checkout;
  let token = req.body.stripeToken;
  stripe.charges.create({
    amount: orderInfo.revenue,
    currency: 'usd',
    description: "Test Charge",
    source: token
  })
    .then((charge) => {
      let order = new Order({
        orderDescription: "Test Charge",
        revenue: orderInfo.revenue,
        stripeToken: token,
        stripeId: charge.id,
        cardType: charge.source.brand,
        customer: orderInfo.customer,
        address: orderInfo.address,
        orderLine: orderInfo.orderLine
      });

      return order.save();
    })
    .then((order) => {
      req.flash('success', 'Thank you for your purchase');
      req.session.cart.products = {};
      req.session.cart.size = "Empty";
      res.redirect(h.productsPath());
    })
    .catch((e) => res.status(500).send(e.stack));
});

module.exports = router;