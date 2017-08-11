const express = require("express");
const router = express.Router();
const models = require("./../models/sequelize");
const Product = models.Product;
const Category = models.Category;
const {ProductsHelpers, CartHelpers} = require("../helpers");
const {genCartItem} = require("../dbSequelize/queries");

router.get('/', (req, res) => {
  let totalPrice = req.session.cart.reduce((sum, orderItem) => {
    return sum + orderItem.price * orderItem.quantity;
  }, 0)
  let cartQuantity = req.session.cart.length;
  res.render("cart", {cart: req.session.cart, total: totalPrice, cartQuantity});
})

router.post('/addNewItem', (req, res) => {
  req.session.cart = req.session.cart || [];

  genCartItem(req.body.productId).then((cartItem) => {
    req.session.cart.push(cartItem);

    return res.redirect(ProductsHelpers.productsPath());
  }).catch((e) => res.send(`error: ${e}`))
})

router.delete('/:productId', (req, res) => {
  let productId = parseInt(req.params.productId);
  let removeIndex;
  req.session.cart.forEach((orderItem, index) => {
    if (orderItem.productId === productId)
      removeIndex = index;
    }
  )

  if (!isNaN(removeIndex))
    req.session.cart.splice(removeIndex, 1);

  req.method = 'GET';
  return res.redirect(CartHelpers.cartPath())
})

router.delete('/', (req, res) => {
  req.session.cart = [];
  req.method = 'GET';
  return res.redirect(CartHelpers.cartPath())
})

router.put('/:productId', (req, res) => {
  let productId = parseInt(req.params.productId);
  let quantity = parseInt(req.body.quantity);

  req.session.cart.forEach((orderItem, index) => {
    if (orderItem.productId === productId) {
      quantity > 0
        ? orderItem.quantity = quantity
        : req.session.cart.splice(index, 1)
    }
  })

  req.method = 'GET';
  return res.redirect(CartHelpers.cartPath())
})

module.exports = router;
