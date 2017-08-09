var express = require("express");
var router = express.Router();
const { Product } = require("../models/sequelize");

router.get("/", (req, res) => {
  Product.findAll({}).then(products => {
    res.render("products/index", { products });
  });
});

router.get("/show/:productId", (req, res) => {
  Product.findById(req.params.productId).then(product => {
    Product.findAll({
      where: { categoryId: product.categoryId, id: { $ne: product.id } },
      limit: 6
    }).then(relatedProducts => {
      console.log(relatedProducts);
      res.render("products/show", { product, relatedProducts });
    });
  });
});

module.exports = router;
