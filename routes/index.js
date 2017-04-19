var url = require('url');
const express = require('express');
let router = express.Router();
var models = require('./../models/sequelize');
var Product = models.Product;
var Category = models.Category;
var sequelize = models.sequelize;

var onIndex = (req, res) => {
  var products, categories;
  if (!req.session.shoppingCart) {
    req.session.shoppingCart = [];
  }
  var cartProducts = req.session.shoppingCart;

  Product.findAll({
    include: [{ model: Category, required: true }],
    limit: 30
  }).then(product => {
    products = product;
    Category.findAll().then(category => {
      categories = category;
      res.render('products/index', { products, categories, cartProducts });
    });
  });
};

var onSearch = (req, res) => {
  var search = req.query.searchText;
  var products, categories;
  var hasSearched = true;
  var cartProducts = req.session.shoppingCart;

  Product.findAll({
    where: { name: { $iLike: `%${search}%` } },
    include: [{ model: Category, required: true }],
    limit: 30
  }).then(product => {
    products = product;
    Category.findAll().then(category => {
      categories = category;
      res.render('products/index', {
        products,
        categories,
        hasSearched,
        search,
        cartProducts
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
  var cartProducts = req.session.shoppingCart;

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
        res.render('products/index', {
          products,
          categories,
          hasFiltered,
          minPrice,
          maxPrice,
          categoryId,
          cartProducts
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
        res.render('products/index', {
          products,
          categories,
          hasFiltered,
          minPrice,
          maxPrice,
          cartProducts
        });
      });
    });
  }
};

var onOrder = (req, res) => {
  var products, categories;
  var orderBy = req.query.orderBy;
  var cartProducts = req.session.shoppingCart;

  Product.findAll({
    include: [{ model: Category, required: true }],
    order: orderBy,
    limit: 30
  }).then(product => {
    products = product;
    Category.findAll().then(category => {
      categories = category;
      res.render('products/index', { products, categories, cartProducts });
    });
  });
};

router.get('/', onIndex);
router.get('/search', onSearch);
router.get('/filter', onFilter);
router.get('/order', onOrder);

var onAdd = (req, res) => {
  var productId = req.body.productId;

  Product.findById(productId, {
    include: [{ model: Category, required: true }]
  })
    .then(product => {
      console.log(product);
      product.dataValues.quantity = 1;
      req.session.shoppingCart.push(product);
    })
    .then(() => {
      res.redirect('/');
    });
};

router.post('/addToCart', onAdd);

var onShow = (req, res) => {
  var products, currentProduct;
  var cartProducts = req.session.shoppingCart;

  Product.findById(req.params.id, {
    include: [{ model: Category, required: true }]
  }).then(product => {
    currentProduct = product;
    Product.findAll({
      where: { categoryId: currentProduct.categoryId },
      limit: 30
    }).then(result => {
      products = result;
      res.render('products/show', { products, currentProduct, cartProducts });
    });
  });
};

router.get('/products/:id', onShow);

module.exports = router;
