const express = require('express');
const models = require('./../models/sequelize');
const { calculateCart, checkCartContent } = require('./../helpers/cart_helper');

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
      let cart = req.session.cart;
      products = checkCartContent(products, cart.items);
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

router.get('/:id', (req, res) => {
  let cart = req.session.cart;
  const quantity = req.query.quantity;

  if (quantity <= 0) {
    delete cart.items[req.params.id];
    req.flash('success', 'Product removed from cart!');
  } else {
    cart.items[req.params.id] = quantity;
    req.flash('success', 'Product quantity updated!');
  }

  const productIds = Object.keys(cart.items);
  cart.size = productIds.length || 'empty';

  res.redirect('back');
});

router.delete('/', (req, res) => {
  req.session.cart.items = {};
  req.session.cart.size = 'empty';
  req.method = 'GET';
  res.redirect('/cart');
});

module.exports = router;
