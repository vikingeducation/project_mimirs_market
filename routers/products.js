var express = require("express");
var router = express.Router();
var models = require("./../models/sequelize");
var Product = models.Product;
var Category = models.Category;
var sequelize = models.sequelize;

var onIndex = (req, res) => {

  Product.findAll({
    include: [{ model: Category, required: true }]
  }).then(products => {
    Category.findAll().then(categories => {
      res.render("products/index", { products, categories });
    });
  });
};

router.get('/', onIndex);
router.get('/products', onIndex);


module.exports = router;