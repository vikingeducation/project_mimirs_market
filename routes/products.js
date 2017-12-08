var express = require('express');
var router = express.Router();
var models = require('./../models/sequelize');
var Categories = models.Category;
var Products = models.Product;
var sequelize = models.sequelize;
const Op = sequelize.Op;

/* GET users listing. */
router.get('/', async function(req, res, next) {
  //todo
  try {
    result = await Products.findAll();
    categories = await Categories.findAll();
    res.render('product', {result, categories});
  } catch (e) {
    res.status(500).send(e.stack);
  }
  // .catch(e => {
  // 	res.status(500).send(e.stack);
  // });
});

router.get('/search', async (req, res) => {
  let params = {};
	console.log(req.query);
  params['category'] = req.query.category;
  if (req.query.min_max === 'max') {
    params['price'] = {$lte: req.query.price};
  } else {
    params['price'] = {$gte: req.query.price};
  }
    params['nameOrPrice'] = [`${req.query.sort_by}`];
  if (req.query.asc_desc === 'ascending') {
  } else {
    params['nameOrPrice'][1] =  'DESC';
  }
  try {
    let categories = await Categories.findAll();
    let result = await Products.findAll({
      // where: {$and: [{category: params.category}, {price: params.price}, {description: {
      //   [Op.like]: `%${req.query.search}%`}
      where: {$and: [{categoryId: params.category}, {price: params.price}, {[Op.or]: [
    {
      name: {
        [Op.like]: `%${req.query.search}%`
      }
    },
    {
      description: {
        [Op.like]: `%${req.query.search}%`
      }
    },
    {
      categoryId: {
        [Op.like]: `%${req.query.search}%`
      }
    }
  ]}
    ]},
      order: [params.nameOrPrice]
      //where: {$and: [{category: req.body.category}, {price: req.body.price}]},
    });
    console.log(result);
    res.render('product', {result, categories});
  } catch (e) {
    res.status(500).send(e.stack);
  }
});

router.get('/:name', async function(req, res) {
  let productName = req.params.name;
  try{
    let product = await Products.find({where: {name: productName}});
    res.render('productsShow', {product});
  }catch(e){
    res.status(500).send(e.stack);
  }
});

module.exports = router;
