var url = require("url");
const express = require("express");
let router = express.Router();
var models = require("./../models/sequelize");
var Product = models.Product;
var Category = models.Category;
var sequelize = models.sequelize;

var onIndex = (req, res) => {
  var products, categories;

  Product.findAll({
    include: [{ model: Category, required: true }],
    limit: 30
  }).then(product => {
    products = product;
    Category.findAll().then(category => {
      categories = category;
      res.render("products/index", { products, categories });
    });
  });
};

var onShow = (req, res) => {
  var products, currentProduct;

  Product.findById(req.params.id, {
    include: [{ model: Category, required: true }]
  }).then(product => {
    currentProduct = product;
    Product.findAll(
      {
        where: { categoryId: currentProduct.categoryId }
      },
      {
        limit: 30
      }
    ).then(result => {
      products = result;
      res.render("products/show", { products, currentProduct });
    });
  });
};

router.get("/", onIndex);

router.get("/products/:id", onShow);

module.exports = router;
