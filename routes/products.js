var express = require('express');
var router = express.Router();
var models = require('./../models/sequelize');
var Categories = models.Category;
var Products = models.Product;
var sequelize = models.sequelize;
const Op = sequelize.Op;

/* GET users listing. */
router.get('/', async function(req, res, next) {
  console.log(req.session);
  try {
    let result = await Products.findAll();
    let categories = await Categories.findAll();
    res.render('product', {result, categories});
  } catch (e) {
    res.status(500).send(e.stack);
  }
});

router.get('/search', async (req, res) => {
  let params = {};
  params['where'] = {};
  console.log(req.session);
  if (req.query.category.length) {
    params['where']['categoryId'] = `${req.query.category}`;
  }
  if (req.query.price.length && req.query.min_max.length) {
    if (req.query.min_max === 'max') {
      params['where']['price'] = {$lte: req.query.price};
    } else if (req.query.min_max === 'min') {
      params['where']['price'] = {$gte: req.query.price};
    }
  }
  if (req.query.sort_by.length && req.query.asc_desc === 'ascending') {
    params['order'] = [[`${req.query.sort_by}`]];
  } else if (req.query.sort_by.length && req.query.asc_desc === 'descending') {
    params['order'] = [[`${req.query.sort_by}`, 'DESC']];
  }
  if (req.query.search.length) {
    let searchString = `%${req.query.search}%`;
    params['where'][Op.or] = [
      {name: {[Op.iLike]: searchString}},
      {description: {[Op.iLike]: searchString}},
    ];
  }
  try {
    let categories = await Categories.findAll();
    let result = await Products.findAll(params);
    res.render('product', {result, categories});
  } catch (e) {
    res.status(500).send(e.stack);
  }
});

router.get('/:name', async function(req, res) {
  console.log(req.session);
  console.log(req.session.userId);
  let productName = req.params.name;
  try {
    let product = await Products.find({where: {name: productName}});
    let relatedArray = await Products.findAll({
      where: {categoryId: product.categoryId},
    });
    res.render('productsShow', {product, relatedArray});
  } catch (e) {
    res.status(500).send(e.stack);
  }
});

module.exports = router;
