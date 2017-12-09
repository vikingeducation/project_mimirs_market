const express = require('express');
const app = express();
const router = express.Router();
const {Product, Category} = require('../models/sequelize');

// ----------------------------------------
// Index of Shopping Cart
// ----------------------------------------

router.get('/', async (req, res, next) => {
  try {
    itemsArr = req.session.items;

    // // Set Quantity
    // let products = await Product.findById(req.query.quantity, {
    //   include: Category,
    // });
    //
    // // for (let i in req.query.quantity.submission) {
    // //   req.session.items.push(product);
    // // }

    // Total
    let prices = [];
    req.session.items.forEach((obj) => {
      prices.push(obj.price);
    });

    let total = prices.reduce((a, b) => a + b, 0);
    req.session.total = total;
    res.render('cart/index', {itemsArr, total});
  } catch (e) {
    next(e);
  }
});

// ----------------------------------------
// Remove Product in Shopping Cart
// ----------------------------------------
router.get('/:id/remove', async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id, {
      include: Category,
    });

    let index = req.session.items.indexOf(product);
    req.session.items.splice(index, 1);

    res.redirect('/cart');
  } catch (e) {
    next(e);
  }
});

// ----------------------------------------
// Add Product to Shopping Cart
// ----------------------------------------
router.get('/:id', async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id, {
      include: Category,
    });

    // add to cart
    // work with arrays instead of class. initialize cart can happen in middleware
    req.session.items.push(product);

    res.redirect('/cart');
  } catch (e) {
    next(e);
  }
});

// ----------------------------------------
// Clear Shopping Cart
// ----------------------------------------
router.get('/clear', async (req, res, next) => {
  try {
    req.session.items = [];
    res.render('cart/index', {});
  } catch (e) {
    next(e);
  }
});

module.exports = router;
