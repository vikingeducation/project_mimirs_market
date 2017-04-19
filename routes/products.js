const express = require("express");
const router = express.Router();
const models = require("./../models/sequelize");
const sequelize = models.sequelize;

const { Product, Category } = models;

// ----------------------------------------
// Index
// ----------------------------------------
router.get("/", (req, res) => {
  const queryObj = _makeQuery(req.query);

  let products;
  Product.findAll(queryObj)
    .then(prod => {
      products = prod;
      return Category.findAll({});
    })
    .then(categories => {
      res.render("products/index", { products, categories });
    })
    .catch(e => res.status(500).send(e.stack));
});

// ----------------------------------------
// Show
// ----------------------------------------
router.get("/:id", (req, res) => {
  Product.findById(req.params.id, {
    include: [
      {
        model: Category,
        include: [
          {
            model: Product,
            where: {
              id: { $ne: req.params.id }
            },
            include: [{ model: Category }]
          }
        ]
      }
    ]
  })
    .then(product => {
      if (product) {
        res.render("products/show", { product });
      } else {
        res.send(404);
      }
    })
    .catch(e => res.status(500).send(e.stack));
});

module.exports = router;

//

//

//

function _makeQuery(query) {
  if (query.search) {
    const searchQuery = query.search;
    return {
      include: [{ all: true }],
      where: { name: { $iLike: `%${searchQuery}%` } }
    };
  } else if (query.category) {
    let min = query.min || 0;
    let max = query.max || 1000;
    let category = query.category === "All"
      ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      : [query.category];
    return {
      include: [{ all: true }],
      where: { price: { $gte: min, $lte: max }, categoryId: { $in: category } }
    };
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
    return {
      include: [{ all: true }],
      order: orderParam
    };
  } else {
    return {
      include: [{ all: true }]
    };
  }
}
