var express = require("express");
var router = express.Router();
const { Product } = require("../models/sequelize");

//index Route
router.get("/", (req, res) => {
  Product.findAll({}).then(products => {
    res.render("products/index", { products });
  });
});

//show Route
router.get("/show/:productId", (req, res) => {
  Product.findById(req.params.productId).then(product => {
    Product.findAll({
      where: { categoryId: product.categoryId, id: { $ne: product.id } },
      limit: 6
    }).then(relatedProducts => {
      res.render("products/show", { product, relatedProducts });
    });
  });
});

///search
router.post("/search", (req, res) => {
  let r = `${req.body.search}`;
  Product.findAll({
    where: {
      name: { $regexp: r }
    }
  }).then(products => {
    res.render("products/index", { products });
  });
});

router.post("/sort", (req, res) => {
  let cascade;
  let param = req.body.sortOption.slice(0, -1);
  param === "date" ? (param = "createdAt") : (param = param);
  /[name|price|date]A$/.test(req.body.sortOption)
    ? (cascade = "ASC")
    : (cascade = "DESC");
  Product.findAll({ order: [param] }).then(products => {
    res.render("products/index", { products });
  });
});

module.exports = router;
