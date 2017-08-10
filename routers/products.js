var express = require("express");
var router = express.Router();
var models = require("./../models/sequelize");
const Product = models.Product;
const Category = models.Category;

// ----------------------------------------
// Index
// ----------------------------------------
router.get("/", (req, res) => {
  let categories;
  let products;
  Product.findAll({ include: models.Category })
    .then(result => {
      products = result;
      return Category.findAll();
    })
    .then(result => {
      categories = result;
      res.render("products/index", { products, categories });
    })
    .catch(e => res.status(500).send(e.stack));
});

// ----------------------------------------
// Add to Cart
// ----------------------------------------
// router.get("/add", (req, res) => {
//   res.render("users/new");
// });

// ----------------------------------------
// Show
// ----------------------------------------
router.get("/:id", (req, res) => {
  Product.findById(req.params.id, {
    include: { model: models.Category, include: { model: models.Product } }
  })
    .then(product => {
      console.log(product);
      res.render("products/single", { product });
    })
    .catch(e => res.status(500).send(e.stack));
});

module.exports = router;
