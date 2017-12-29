// Index.js

var express = require('express');
var router = express.Router();

const models = require('./../models/sequelize');
const Category = models.Category;
const Product = models.Product;

const showcaser = require('./../ProductShowcaser.js');
let queryConstructor = showcaser.queryConstructor;
let objectify = showcaser.objectify;

/* GET users listing. */
router.get('/', async function(req, res, next) {
  // let result = await Promise.all(Product.findAll(queryConstructor("s", "Italian")));
  Product.findAll({
    include: [{model: Category}],
    limit: 20,
  }).then(qproducts => {
    let products = qproducts.map(product => objectify(product));
    console.log(products);
    res.render('welcome/index', {products});
  });
});

router.get('/filter', (req, res, next) => {
  console.log();
  Product.findAll(
    queryConstructor(
      req.query.search,
      req.query.category,
      Number(req.query.min),
      Number(req.query.max),
      req.query.sort,
    ),
  ).then(qproducts => {
    let products = qproducts.map(product => objectify(product));
//    console.log(products.slice(0,5));
    res.render('welcome/index', {products});
  });
});

module.exports = router;

Product.findAll(queryConstructor('sausages', null, 500)).then(products => {
  let searchArray = products.map(product => objectify(product));
});
