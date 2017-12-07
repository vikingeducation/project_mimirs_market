var express = require('express');
var router = express.Router();
var models = require('./../models/sequelize');
var Categories = models.Category;
var Products = models.Product;
var sequelize = models.sequelize;

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

router.post('/search', (req, res) => {
	let params = {};
	params['category'] = req.body.category;
  if(req.body.min_max === "max"){
    params['price'] = {$lte:req.body.price};
  }else{
    params['price'] = {$gte:req.body.price};
  }
  Products.findAll({
	  where: {$and: [{category: params.category}, {price: params.price}]}
	    //where: {$and: [{category: req.body.category}, {price: req.body.price}]},
  }).then(result => {
    console.log(result);
    res.render('product', {result});
  });
});

router.post('/sort', (req, res) => {
	let params = {};
	params['nameOrPrice'] = req.body.sort_by;
  if(req.body.asc_desc === "ascending"){
    params['nameOrPrice'] = `${req.body.sort_by}`;
  }else{
    params['nameOrPrice'] = `${req.body.sort_by} DESC`;
  }
  Products.findAll({
	  order: `'${params.nameOrPrice}'`
  }).then(result => {
    console.log("Sort result: ",result);
    res.render('product', {result});
  });
});

module.exports = router;
