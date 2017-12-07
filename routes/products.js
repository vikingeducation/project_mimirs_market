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
    params['price'] = {$lt:req.body.price};
  }else{
    params['price'] = {$gt:req.body.price};
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
	params['category'] = req.body.category;
  if(req.body.min_max === "max"){
    params['price'] = {$lt:req.body.price};
  }else{
    params['price'] = {$gt:req.body.price};
  }
  Products.findAll({
	  where: {$and: [{category: params.category}, {price: params.price}]}
	    //where: {$and: [{category: req.body.category}, {price: req.body.price}]},
  }).then(result => {
    console.log(result);
    res.render('product', {result});
  });
});

module.exports = router;
