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


const getTotals = (cart, products) => {
  let total = 0;
  for (let key in cart) {
    products.forEach(product => {
      if (product.id.toString() === key) {
        total += product.price * cart[key]
      }
    });
  }
  return total;
};

router.get('/', (req, res) => {
  let cart = req.session.cart;
  let products = Object.keys(cart.products);
  let states;

  State.findAll()
    .then(results => {
      states = results;
      return Product.findAll({
        where: {id: products},
        include: [{model: Category}]
      });
    })
    .then(results => {
      console.log(JSON.stringify(results, null, 2));
      let total = getTotals(cart.products, results);
      res.render('checkout/index', { products: results, total, states, STRIPE_PK });
    })
    .catch(e => {
      if (e.errors) {
        e.errors.forEach((err) => req.flash('error', err.message));
        res.redirect('back');
      } else {
        res.status(500).send(e.stack);
      }
    });
});

module.exports = router;