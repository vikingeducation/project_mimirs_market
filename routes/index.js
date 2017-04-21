const express = require("express");
let router = express.Router();
var models = require("./../models/sequelize");
var Product = models.Product;
var Category = models.Category;
var sequelize = models.sequelize;

var onIndex = (req, res) => {
  var products;
  if (!req.session.shoppingCart) {
    req.session.shoppingCart = [];
  }
  var cartProducts = req.session.shoppingCart;
  Product.findAll({
    include: [{ model: Category, required: true }],
    limit: 32
  })
    .then(result => {
      products = result;
      Category.findAll().then(categories => {
        res.render("products/index", { products, categories, cartProducts });
      });
    })
    .catch(() => res.status(500).send(e.stack));
};

var onSearch = (req, res) => {
  var products;
  var search = req.query.searchText;
  var cartProducts = req.session.shoppingCart;
  var minPrice = req.query.minPrice;
  var maxPrice = req.query.maxPrice;
  var categoryId = req.query.product.categoryId;
  var orderBy = req.query.orderBy;

  var whereAnd = [];
  if (minPrice) {
    whereAnd.push({ price: { $gte: minPrice } });
  }
  if (maxPrice) {
    whereAnd.push({ price: { $lte: maxPrice } });
  }
  if (categoryId) {
    whereAnd.push({ categoryId });
  }
  if (search) {
    whereAnd.push({ description: { $iLike: `%${search}%` } });
  }

  Product.findAll({
    where: {
      $and: whereAnd
    },
    include: [{ model: Category, required: true }],
    order: orderBy,
    limit: 32
  })
    .then(result => {
      products = result;
      Category.findAll().then(categories => {
        req.flash("success", "Your Search Results");
        res.render("products/index", {
          products,
          categories,
          search,
          minPrice,
          maxPrice,
          categoryId,
          cartProducts
        });
      });
    })
    .catch(() => res.status(500).send(e.stack));
};

var onShow = (req, res) => {
  var currentProduct;
  var cartProducts = req.session.shoppingCart;

  Product.findById(req.params.id, {
    include: [{ model: Category, required: true }]
  })
    .then(product => {
      currentProduct = product;
      Product.findAll({
        where: {
          $and: [
            { categoryId: currentProduct.categoryId },
            { id: { $ne: currentProduct.id } }
          ]
        },
        limit: 32
      }).then(products => {
        res.render("products/show", { products, currentProduct, cartProducts });
      });
    })
    .catch(() => res.status(500).send(e.stack));
};

var onAdd = (req, res) => {
  var productId = req.body.productId;

  Product.findById(productId, {
    include: [{ model: Category, required: true }]
  })
    .then(product => {
      product.dataValues.quantity = 1;
      req.session.shoppingCart.push(product);
    })
    .then(() => {
      req.flash("success", "Item added to the cart!");
      res.redirect("back");
    })
    .catch(() => res.status(500).send(e.stack));
};

router.get("/", onIndex);
router.get("/search", onSearch);
router.get("/products/:id", onShow);
router.post("/addToCart", onAdd);

module.exports = router;
