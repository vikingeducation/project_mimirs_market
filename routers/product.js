var express = require("express");
var router = express.Router();
var models = require("../models/sequelize");
var Product = models.Product;
var Category = models.Category;
var sequelize = models.sequelize;

module.exports = app => {
  router.get("/:id", (req, res) => {
    Product.findAll({
      where: { id: req.params.id },
      include: [Category]
    }).then(mainProduct => {
      Product.findAll({
        where: { categoryId: mainProduct[0].categoryId },
        include: [Category]
      }).then(productsByCategory => {
        mainProduct = mainProduct[0];
        res.render("product/start", { mainProduct, productsByCategory });
      });
    });
  });
  return router;
};
