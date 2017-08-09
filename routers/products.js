var express = require("express");
var router = express.Router();
const { Product } = require("../models/sequelize");

router.get("/", (req, res) => {
  Product.findAll({}).then(products => {
    console.log(`Products = ${products}`);
    res.render("products/index", { products: products[0] });
  });
});

module.exports = router;
