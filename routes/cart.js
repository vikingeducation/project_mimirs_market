var url = require('url');
const express = require('express');
let router = express.Router();
var models = require('./../models/sequelize');
var Product = models.Product;
var Category = models.Category;
var sequelize = models.sequelize;

router.get('/', (req, res) => {
  var cartProducts = req.session.shoppingCart;
  res.render('cart/index', { cartProducts });
});

router.post('/updateQuantity', (req, res) => {
  var quantity = req.body.productQuantity;
  var productId = Number(req.body.productId);
  var shoppingCart = req.session.shoppingCart;

  shoppingCart.forEach(product => {
    if (product.id === productId) {
      product.quantity = quantity;
    }
  });

  req.session.shoppingCart = shoppingCart;
  res.redirect('back');
});

router.post('/remove', (req, res) => {
  var productId = Number(req.body.productId);
  var shoppingCart = req.session.shoppingCart;
  var indexOfRemoval;

  shoppingCart.forEach((product, index) => {
    if (product.id === productId) {
      indexOfRemoval = index;
    }
  });

  shoppingCart.splice(indexOfRemoval, 1);
  req.session.shoppingCart = shoppingCart;
  res.redirect('back');
});

router.post('/clear', (req, res) => {
  req.session.shoppingCart = [];
  res.redirect('back');
});

module.exports = router;
