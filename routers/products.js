var express = require("express");
var router = express.Router();
var models = require("./../models/sequelize");
const Product = models.Product;
const Category = models.Category;
const filter = require("./../helpers/filterHandler.js");

// ----------------------------------------
// Index
// ----------------------------------------
router.get("/", (req, res) => {
  const queryObj = filter(req.query);

  console.log("queryObj is: ", queryObj);

  let categories;
  let products;
  Product.findAll(queryObj)
    .then(results => {
      products = results;
      return Category.findAll();
    })
    .then(results => {
      categories = results;
      return res.render("products/index", { products, categories });
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
  let product;
  let relatedCategoryId;
  let relatedProducts;
  Product.findById(req.params.id)

  .then(result => {
    product = result;
    relatedCategoryId = product.CategoryId;
    return Product.findAll({
      where: {CategoryId: relatedCategoryId}
    })
  }) 
  
  .then(results => {
    relatedProducts = results
    return res.render("products/single", { product, relatedProducts });
    })
  .catch(e => res.status(500).send(e.stack));
});

module.exports = router;
