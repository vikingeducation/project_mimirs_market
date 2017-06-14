var express = require('express');
var router = express.Router();
var ctrlProducts = require('../controller/products');

/* GET home page. */
router.get('/', ctrlProducts.productIndex);

// POST from search/filter forms
router.post('/', ctrlProducts.productIndex);

// GET product detail
router.get('/detail/:productID', ctrlProducts.productDetail);

module.exports = router;
