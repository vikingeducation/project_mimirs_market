const express = require('express');
const models = require('./../models/sequelize');
const calculateCart = require('./../helpers/cart_helper');

const router = express.Router();
const sequelize = models.sequelize;
const Product = models.Product;
const Category = models.Category;

router.get('/', (req, res) => {
  let cart = req.session.cart;
  const productIds = Object.keys(cart.items);
  let products;

  Product.findAll({
    where: {
      id: productIds
    },
    include: [{ model: Category }]
  })
    .then(result => {
      products = result;
      const total = calculateCart(products, cart.items);

      res.render('cart/show', {
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

router.get('/:id', (req, res) => {});

module.exports = router;
