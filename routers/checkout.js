const express = require('express');
const router = express.Router();
const models = require('../models/sequelize');
const { Product, Category } = models;
const SearchHandler = require('../lib/searchHandler');

router.get('/cart', (req, res) => {
  SearchHandler.findCartProducts(res.locals.cart)
    .then(products => {
      const totalPrice = getTotalPrice(products, res.locals.cart);
      res.render('checkout/index', { products, totalPrice });
    })
    .catch(e => res.status(500).send(e.stack));
});

router.post('/update', (req, res) => {
  let productId = req.body.productId;
  let quantity = parseInt(req.body.quantity);
  let cart = res.locals.cart;

  if (productId && quantity) {
    cart[productId].quantity = quantity;
  } else {
    delete cart[productId];
  }

  cart = JSON.stringify(cart);

  res.cookie('cart', cart);
  res.redirect('/checkout/cart');
});

router.delete('/', (req, res) => {
  res.clearCookie('cart');
  res.redirect('/checkout/cart');
});

router.delete('/:id', (req, res) => {
  let productId = req.params.id;
  let cart = res.locals.cart;

  delete cart[productId];
  cart = JSON.stringify(cart);

  res.cookie('cart', cart);
  res.redirect('/checkout/cart');
});

function getTotalPrice(products, cart) {
  let price = 0;

  for (let product of products) {
    price += product.price * cart[product.id].quantity
  }

  return price;
}

module.exports = router;
