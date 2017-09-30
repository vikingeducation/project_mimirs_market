var express = require("express");
var router = express.Router();
var models = require("../models/sequelize");
var Product = models.Product;
var Category = models.Category;
var sequelize = models.sequelize;

module.exports = app => {
  router.get("/", (req, res) => {
    Product.findAll({
      include: [Category]
    }).then(products => {
      console.log(products[0].Category);
      res.render("search/start", { products });
    });
  });

  return router;
};
