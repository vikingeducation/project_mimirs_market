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
router.get('/', async (req, res, next) => {
  
  let query = queryConstructor(
    req.query.search,
    req.query.category,
    Number(req.query.min),
    Number(req.query.max),
    req.query.sort,
  );

  if (req.query) query.limit = 12;

  let products = (await Product.findAll(query)).map(product =>
    objectify(product),
  );

  res.render('welcome/index', {products});
});

module.exports = router;
