const express = require('express');
const router = express.Router();
const models = require('./../models/sequelize');
const Product = models.Product;
const Category = models.Category;
const State = models.State;
const h = require('./../helpers/path-helpers').registered;
const sequelize = models.sequelize;
const {
  STRIPE_SK,
  STRIPE_PK
} = process.env;
const stripe = require('stripe')(STRIPE_SK);

router.post('/', (req, res) => {
  var charge = req.body;
  stripe.charges.create({
    amount: req.body.checkout.total,
    currency: 'usd',
    description: "Test Charge",
    source: charge.stripeToken
  })
    .then((charge) => {
      console.log(charge);
      // ... Save charge and session data
      // from checkout and cart
      // to MongoDB
    })
    .then(() => {
      req.flash('success', 'Thank you for your purchase');
      req.session.cart.products = {};
      req.session.cart.size = "Empty";
      res.redirect(h.productsPath());
    })
    .catch((e) => res.status(500).send(e.stack));
});

module.exports = router;