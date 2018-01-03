const express = require('express');
const mongoose = require('mongoose');
const models = require('./../models/sequelize');
const mongooseModels = require('./../models/mongoose');
const { calculateCart, checkCartContent } = require('./../helpers/cart_helper');

const router = express.Router();
const sequelize = models.sequelize;
const Product = models.Product;
const State = models.State;
const Order = mongoose.model('Order');
const { STRIPE_SK, STRIPE_PK } = process.env;
const stripe = require('stripe')(STRIPE_SK);

router.post('/', (req, res) => {
  const token = req.body.stripeToken;
  const cart = req.session.cart;
  const productIds = Object.keys(cart.items);
  let states;
  let products;
  let total;
  let orderItems = [];

  const userParams = {
    fname: req.body.order.user.fname,
    lname: req.body.order.user.lname,
    email: req.body.order.user.email
  };
  const addressParams = {
    street: req.body.order.address.street,
    city: req.body.order.address.city,
    stateId: req.body.order.address.state_id
  };

  Product.findAll({
    where: {
      id: productIds
    }
  })
    .then(result => {
      products = result;
      products = checkCartContent(products, cart.items);
      total = calculateCart(products, cart.items);

      products.forEach(product => {
        orderItems.push({
          name: product.name,
          sku: product.sku,
          description: product.description,
          price: product.price,
          categoryId: product.categoryId,
          quantity: product.quantity
        });
      });
      console.dir(orderItems);

      return stripe.charges.create({
        amount: total,
        currency: 'usd',
        description: 'Mimirs Market Purchase',
        source: token
      });
    })
    .then(charge => {
      const order = new Order({
        description: 'Mimirs Market Purchase',
        revenue: total,
        stripeToken: token,
        cardType: charge.source.brand,
        stripeId: charge.id,
        user: userParams,
        address: addressParams,
        orderItems: orderItems
      });

      return order.save();
    })
    .then(() => {
      req.flash('success', 'Purchase complete!');
      req.session.cart = { items: {}, size: 'empty' };
      res.redirect('/products');
    })
    .catch(e => res.status(500).send(e.stack));
});

module.exports = router;
