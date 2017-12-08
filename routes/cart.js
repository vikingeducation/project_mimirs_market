var express = require('express');
var router = express.Router();
var models = require('./../models/sequelize');
var Categories = models.Category;
var Products = models.Product;
var sequelize = models.sequelize;
const Op = sequelize.Op;
var mongoose = require('mongoose');
var mongooseModels = require('./../models/mongoose');
var Cart = mongoose.model('Cart');

/* GET home page. */
router.get('/', async function(req, res, next) {
  let sessionCartArr;
  try {
    sessionCartArr = await Cart.find({userId: req.session.userId});
  } catch (e) {
    res.status(500).send(e.stack);
  }
  let sessionCart = sessionCartArr[0];
  let itemsArr = sessionCart.products;
  res.render('cart', {itemsArr});
});

router.get('/:name/add', async function(req, res) {
  let sessionCartArr;
  try {
    sessionCartArr = await Cart.find({userId: req.session.userId});
  } catch (e) {
    res.status(500).send(e.stack);
  }
  let sessionCart;
  if (!sessionCartArr.length) {
    sessionCart = new Cart();
    sessionCart.userId = req.session.userId;
    try {
      sessionCart.save();
    } catch (e) {
      res.status(500).send(e.stack);
    }
  } else {
    sessionCart = sessionCartArr[0];
  }
  let itemName = req.params.name;
  // let itemToAdd = await Products.find({where:{name: itemName}});
  let itemsInCart = sessionCart.products.map(x => x[0]);
  if (itemsInCart.includes(itemName)) {
    let indexOfItem = itemsInCart.findIndex(x => x === itemName);
    sessionCart.products[indexOfItem][1] = (
      Number(sessionCart.products[indexOfItem][1]) + 1
    ).toString();
    try {
      await Cart.findByIdAndUpdate(sessionCart._id, sessionCart);
    } catch (e) {
      res.status(500).send(e.stack);
    }
  } else {
    sessionCart.products.push([itemName, 1]);
  }
  console.log(sessionCart);
  try {
    sessionCart.save();
  } catch (e) {
    res.status(500).send(e.stack);
  }
  // res.render('cart', {renderThing: JSON.stringify(sessionCart, null, ' ')});
  res.redirect('/cart');
});

router.get('/:name/mod', async function(req, res) {
  let sessionCartArr;
  try {
    sessionCartArr = await Cart.find({userId: req.session.userId});
  } catch (e) {
    res.status(500).send(e.stack);
  }
  let sessionCart;
  if (!sessionCartArr.length) {
    sessionCart = new Cart();
    sessionCart.userId = req.session.userId;
    try {
      sessionCart.save();
    } catch (e) {
      res.status(500).send(e.stack);
    }
  } else {
    sessionCart = sessionCartArr[0];
  }
  let itemName = req.params.name;
  // let itemToAdd = await Products.find({where:{name: itemName}});
  let itemsInCart = sessionCart.products.map(x => x[0]);
  if (itemsInCart.includes(itemName) && req.query.new >= 0) {
    let indexOfItem = itemsInCart.findIndex(x => x === itemName);
    sessionCart.products[indexOfItem][1] = req.query.new.toString();
    try {
      await Cart.findByIdAndUpdate(sessionCart._id, sessionCart);
    } catch (e) {
      res.status(500).send(e.stack);
    }
  }
  try {
    sessionCart.save();
  } catch (e) {
    res.status(500).send(e.stack);
  }
  // res.render('cart', {renderThing: JSON.stringify(sessionCart, null, ' ')});
  res.redirect('/cart');
});

module.exports = router;
