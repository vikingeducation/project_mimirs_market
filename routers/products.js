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
      console.log(relatedProducts);
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
    console.log(`products = ${products}`);
    res.render("products/index", { products });
  });
});

module.exports = router;
