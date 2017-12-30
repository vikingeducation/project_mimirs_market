var express = require('express');
var router = express.Router();

const models = require('./../models/sequelize');
const Category = models.Category;
const Product = models.Product;

const showcaser = require('./../ProductShowcaser.js');
let queryConstructor = showcaser.queryConstructor;
let objectify = showcaser.objectify;

const ShoppingCart = require('../shoppingCart.js');
let cart = new ShoppingCart();

console.log("Maybe here.. ?");
/* GET users listing. */
router.get('/', async (req, res, next) => {
  let products = await Product.findAll({
  })
  products = products.map(product => objectify(product));
  res.render('welcome/shopping_cart', {products});
});

router.get('/addNew', async (req, res, next) => {

  req.session.cart.push(req.query.cartId);

  //Product.findById(req.query.cartId, {
    //include: [{model: Category}],
    //limit: 20,
  //}).then(product => {
    //cart.add(product);
    //res.render('welcome/shopping_cart');
  //})
  //let products = qproducts.map(product => objectify(product));
  //console.log(products);
  res.redirect('/shoppingCart');
});

module.exports = router;


