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
router.get('/', function(req, res, next) {
  Product.findAll({
    include: [{model: Category}],
    limit: 20,
  }).then(qproducts => {
    let products = qproducts.map(product => objectify(product));
    console.log(products);
    res.render('welcome/shopping_cart', {products});
  });
});

//router.get('/addNew', (req, res, next) => {
  //console.log(req.query.cartId)
  //Product.findById(req.query.cartId, {
    //include: [{model: Category}],
    //limit: 20,
  //}).then(product => {
    //cart.add(product);
    //res.render('welcome/shopping_cart', {cart.products});
  //})
  //let products = qproducts.map(product => objectify(product));
  //console.log(products);
//});
module.exports = router;


