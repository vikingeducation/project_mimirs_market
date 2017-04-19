var url = require("url");
const express = require("express");
let router = express.Router();
var models = require("./../models/sequelize");
var Product = models.Product;
var Category = models.Category;
var sequelize = models.sequelize;

router.get("/", (req, res) => {
  var products = req.session.shoppingCart;
  res.render("cart/index", { products });
});

router.post("/updateQuantity", (req, res) => {
  var quantity = req.body.productQuantity;
  var productId = req.body.productId;
  var shoppingCart = req.session.shoppingCart;

  shoppingCart.forEach(product => {
    if ((product.id = productId)) {
      product.quantity = quantity;
    }
  });
  req.session.shoppingCart = shoppingCart;
  res.redirect("back");
});

module.exports = router;
