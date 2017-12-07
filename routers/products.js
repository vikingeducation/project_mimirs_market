const express = require("express");
const app = express();
const router = express.Router();
const { Product, sequelize, Category } = require("../models/sequelize");
const h = require("../helpers");

// ----------------------------------------
// Image Path
// ----------------------------------------

let productImagePath = product =>
  `/assets/images/product${product.id.image}.jpg`;

// ----------------------------------------
// Index
// ----------------------------------------
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render("products/index", { products });
  } catch (e) {
    next(e);
  }
});

// ----------------------------------------
// Show
// ----------------------------------------
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id, {
      include: Category
    });
    console.log(product);
    if (!product) {
      req.flash("error", "Product not found");
      return res.redirect("/products");
    }
    res.render("products/show", { product });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
