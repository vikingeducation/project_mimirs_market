var express = require("express");
var router = express.Router();
const { Product, Category } = require("../models/sequelize");
const checkIfInCart = require("../lib/checkifincart");

//get all products, render index
router.get("/", (req, res) => {
  res.cookie("searchValue", "search");
  Product.findAll()
    .then(products => {
      return checkIfInCart(req, res, products);
    })
    .then(products => {
      return res.render("products/index", { products });
    });
});

//get 1 product, get related products, render product 'show' page
router.get("/show/:productId", (req, res) => {
  let product;
  Product.findById(req.params.productId)
    .then(p => {
      product = p;
      return Product.findAll({
        where: { categoryId: product.categoryId, id: { $ne: product.id } },
        limit: 6
      });
    })
    .then(relatedProducts => {
      return res.render("products/show", { product, relatedProducts });
    });
});

//retain/set "search" cookie, find search results, render index
router.post("/search", (req, res) => {
  let search = req.body.search;
  res.cookie("searchValue", search);
  Product.findAll({
    where: {
      name: { $regexp: search }
    }
  })
    .then(products => {
      return checkIfInCart(req, res, products);
    })
    .then(products => {
      return res.render("products/index", { products });
    });
});

//retain "search" cookie, retain products on page, find and sort, render index
router.post("/sort", (req, res) => {
  res.cookie("searchValue", req.cookies.searchValue || "search");
  if (req.body.sortOption) {
    res.cookie("selectedSortOption", req.body.sortOption);
  }
  let productIds = Object.keys(req.body.shownProducts).map(
    el => req.body.shownProducts[el]
  );
  let param = req.body.sortOption.split("-")[0];
  let cascade = req.body.sortOption.split("-")[1];
  Product.findAll({
    where: { id: { $in: productIds } },
    order: [[param, cascade]]
  })
    .then(products => {
      return checkIfInCart(req, res, products);
    })
    .then(products => {
      return res.render("products/index", { products });
    });
});

//extract filters, find products, render index
router.post("/filter", (req, res) => {
  Product.findAll({
    include: [
      {
        model: Category,
        where: {
          name: { $regexp: eq.body.filterOption.category }
        }
      }
    ],
    where: {
      price: {
        $between: [
          req.body.filterOption.minPrice,
          req.body.filterOption.maxPrice
        ]
      }
    }
  })
    .then(products => {
      return checkIfInCart(req, res, products);
    })
    .then(products => {
      return res.render("products/index", { products });
    });
});

module.exports = router;
