var url = require("url");
const express = require("express");
let router = express.Router();
var models = require("./../models/sequelize");
var Product = models.Product;
var Category = models.Category;
var sequelize = models.sequelize;

var onIndex = (req, res) => {
  var products, categories;

  Product.findAll({
    include: [{ model: Category, required: true }],
    limit: 30
  }).then(product => {
    products = product;
    Category.findAll().then(category => {
      categories = category;
      res.render("products/index", { products, categories });
    });
  });
};

var onSearch = (req, res) => {
  var search = req.query.searchText;
  var products, categories;
  var hasSearched = true;

  Product.findAll({
    where: { name: { $like: `%${search}%` } },
    include: [{ model: Category, required: true }],
    limit: 30
  }).then(product => {
    products = product;
    Category.findAll().then(category => {
      categories = category;
      res.render("products/index", {
        products,
        categories,
        hasSearched,
        search
      });
    });
  });
};

var onFilter = (req, res) => {
  var minPrice = req.query.minPrice;
  var maxPrice = req.query.maxPrice;
  var categoryId = req.query.product.categoryId;
  var products, categories;
  var hasFiltered = true;

  !minPrice ? (minPrice = 0) : minPrice;
  !maxPrice ? (maxPrice = 9999) : maxPrice;

  if (categoryId) {
    Product.findAll({
      where: {
        $and: [
          { price: { $gte: minPrice } },
          { price: { $lte: maxPrice } },
          { categoryId }
        ]
      },
      include: [{ model: Category, required: true }],
      limit: 30
    }).then(product => {
      products = product;
      Category.findAll().then(category => {
        categories = category;
        res.render("products/index", {
          products,
          categories,
          hasFiltered,
          minPrice,
          maxPrice,
          categoryId
        });
      });
    });
  } else {
    Product.findAll({
      where: {
        $and: [{ price: { $gte: minPrice } }, { price: { $lte: maxPrice } }]
      },
      include: [{ model: Category, required: true }],
      limit: 30
    }).then(product => {
      products = product;
      Category.findAll().then(category => {
        categories = category;
        res.render("products/index", {
          products,
          categories,
          hasFiltered,
          minPrice,
          maxPrice
        });
      });
    });
  }
};

router.get("/search", onSearch);

// var onFilter = (req, res) => {};
//
// var onSort = (req, res) => {};

router.get("/", onIndex);
router.get("/filter", onFilter);
// router.post('/products/sort', onSort);

var onShow = (req, res) => {
  var products, currentProduct;

  Product.findById(req.params.id, {
    include: [{ model: Category, required: true }]
  }).then(product => {
    currentProduct = product;
    Product.findAll({
      where: { categoryId: currentProduct.categoryId },
      limit: 30
    }).then(result => {
      products = result;
      res.render("products/show", { products, currentProduct });
    });
  });
};

router.get("/products/:id", onShow);

module.exports = router;
