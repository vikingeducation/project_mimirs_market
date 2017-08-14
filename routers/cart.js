const express = require("express");
const router = express.Router();
const models = require("./../models/sequelize");
const Product = models.Product;
const Category = models.Category;
const {ProductsHelpers, CartHelpers} = require("../helpers");
const {genCartItem} = require("../controller/queries");

router.get('/', (req, res) => {
  let cart = req.session.cart;
  let cartQuantity = cart.length;
  let cartTotal = cart.reduce((sum, orderItem) => {
    return sum + orderItem.totalPrice;
  }, 0)

  res.render("cart", {cart: req.session.cart, total: cartTotal, cartQuantity});
})

router.post('/addNewItem', (req, res) => {
  req.session.cart = req.session.cart || [];

  genCartItem(req.body.productId).then((cartItem) => {
    req.session.cart.push(cartItem);

    return req.body.productPage === 'true' ?
    res.redirect(ProductsHelpers.productPath(req.body.productIdView, req.body.CategoryIdView)) :
    res.redirect(ProductsHelpers.productsPath())
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
      if(quantity > 0) {
        orderItem.quantity = quantity;
        orderItem.totalPrice = quantity * orderItem.price;
      } else {
        req.session.cart.splice(index, 1)
      }
    }
  })

  req.method = 'GET';
  return res.redirect(CartHelpers.cartPath())
})

router.get('/checkout', (req, res) => {
  let cart = req.session.cart || [];
  let cartTotalPrice = cart.reduce((sum, orderItem) => {
    return sum + orderItem.totalPrice;
  }, 0)
  return res.render("checkout", { cart, cartTotalPrice });
})

router.post('/checkout', (req, res) => {
  req.session.order = req.body.order;
  res.redirect('/charges');
})

module.exports = router;
