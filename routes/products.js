const express = require("express");
const router = express.Router();
const models = require("./../models/sequelize");
const sequelize = models.sequelize;

const { Product, Category } = models;

// ----------------------------------------
// Index
// ----------------------------------------
router.get("/", (req, res, next) => {
  const queryObj = _makeQuery(req.query);

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
    include: [{
      model: Category,
      include: [
        {
          model: Product,
          include: [{ model: Category }],
          where: { id: { $ne: req.params.id } },
        }
      ]
    }]
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

function _makeQuery(query) {
  let queryObj = { include: [{ all: true }] };
  if (query.search) {
    queryObj.where = { name: { $iLike: `%${query.search}%` } };
  } else if (query.category) {
    let min = query.min || 0;
    let max = query.max || 1000;
    let category = query.category === "All"
      ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      : [query.category];
    queryObj.where = { price: { $gte: min, $lte: max }, categoryId: { $in: category } };
  } else if (query.sort) {
    let orderParam;
    switch (query.sort) {
      case "price":
        orderParam = "price";
        break;
      case "priceDesc":
        orderParam = "price DESC";
        break;
      case "name":
        orderParam = "name";
        break;
      case "nameDesc":
        orderParam = "name DESC";
        break;
      case "created":
        orderParam = '"createdAt"';
        break;
      case "createdDesc":
        orderParam = '"createdAt" DESC';
        break;
      default:
        orderParam = "";
    }
    queryObj.where = { order: orderParam };
  }
  return queryObj;
}
