const express = require("express");
const router = express.Router();
const models = require("./../models/sequelize");
const sequelize = models.sequelize;
const makeQuery = require("../sortHelper/index");

const { Product, Category } = models;

// ----------------------------------------
// Index
// ----------------------------------------
router.get("/", (req, res, next) => {
  const queryObj = makeQuery(req.query);

  let products;
  Product.findAll(queryObj)
    .then(allProducts => {
      products = allProducts;
      return Category.findAll();
    })
    .then(categories => {
      let cartIds = [];
      if (req.cookies.cart) {
        cartIds = Object.keys(req.cookies.cart).map(i => +i);
      }
      res.render("products/index", { products, categories, cartIds });
    })
    .catch(next);
});

// ----------------------------------------
// Show
// ----------------------------------------
router.get("/:id", (req, res, next) => {
  Product.findById(req.params.id, {
    include: [
      {
        model: Category,
        include: [
          {
            model: Product,
            include: [{ model: Category }],
            where: { id: { $ne: req.params.id } }
          }
        ]
      }
    ]
  })
    .then(product => {
      if (product) {
        let cartIds = [];
        if (req.cookies.cart) {
          cartIds = Object.keys(req.cookies.cart).map(i => +i);
        }
        res.render("products/show", { product, cartIds });
      } else {
        res.send(404);
      }
    })
    .catch(next);
});

module.exports = router;

//

//

//
