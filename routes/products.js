var express = require('express');
var router = express.Router();
var models = require('./../models/mongoose');
var Categories = models.Category;
var Products = models.Product;

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    let result = await Products.find();
    let categories = await Categories.find();
    res.render('product', {result, categories});
  } catch (e) {
    res.status(500).send(e.stack);
  }
});
router.get('/search', async (req, res, next) =>{
  let params = {};
  if (req.query.search.length) {
    let searchString = `${req.query.search}`;
    params['$or'] = [
      {name: new RegExp(searchString, 'i')},
      {description: new RegExp(searchString, 'i')},
    ];
  }
  try {
    let categories = await Categories.find();
    let result = await Products.find(params);
    res.render('product', {result, categories});
  } catch (e) {
    res.status(500).send(e.stack);
  }
});

router.get('/filter', async (req, res) => {
  let params = {};
  if (req.query.category.length) {
    params['categoryId'] = `${req.query.category}`;
  }
  if (req.query.price.length && req.query.min_max.length) {
    if (req.query.min_max === 'max') {
      params['price'] = {$lte: req.query.price};
    } else if (req.query.min_max === 'min') {
      params['price'] = {$gte: req.query.price};
    }
  }
  try {
    let categories = await Categories.find();
    let result = await Products.find(params);
    res.render('product', {result, categories});
  } catch (e) {
    res.status(500).send(e.stack);
  }
});

router.get('/:id', async function(req, res) {
  try {
    let product = await Products.findById(req.params.id);
    let relatedArray = await Products.find({
      categoryId: product.categoryId
    });
    res.render('productsShow', {product, relatedArray});
  } catch (e) {
    res.status(500).send(e.stack);
  }
});

module.exports = router;
