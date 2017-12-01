var express = require("express");
var router = express.Router();

const seqeulize = require("sequelize");
var models = require("./../models/sequelize");
var Product = models.Product;
var sequelize = models.sequelize;

var onIndex = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render('products/index', { products });
    })
    .catch((e) => res.status(500).send(e.stack));
};
router.get('/', onIndex);
router.get('/products', onIndex);


module.exports = router;