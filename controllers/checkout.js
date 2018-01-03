const express = require('express');
const models = require('./../models/sequelize');
const { calculateCart, checkCartContent } = require('./../helpers/cart_helper');

const router = express.Router();
const sequelize = models.sequelize;
const Product = models.Product;
const State = models.State;

router.get('/', (req, res) => {
  const cart = req.session.cart;
  const productIds = Object.keys(cart.items);
  let states;
  let products;

  State.findAll()
    .then(result => {
      states = result;

      return Product.findAll({
        where: {
          id: productIds
        }
      });
    })
    .then(result => {
      products = result;
      products = checkCartContent(products, cart.items);
      const total = calculateCart(products, cart.items);

      res.render('checkouts/new', {
        states,
        products,
        total
      });
    })
    .catch(e => {
      if (e.errors) {
        e.errors.forEach(err => req.flash('error', err.message));
        res.redirect('back');
      } else {
        res.status(500).send(e.stack);
      }
    });
});

module.exports = router;
