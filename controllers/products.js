const express = require('express');
const models = require('./../models/sequelize');
const { checkCartContent } = require('./../helpers/cart_helper');
const {
  formatSearch,
  getSearchParams,
  formatSortParams
} = require('./../helpers/params_helper');

const router = express.Router();
const sequelize = models.sequelize;
const Product = models.Product;
const Category = models.Category;

router.get('/', (req, res) => {
  let products;
  let categories;
  let sort;
  let search;
  let searchParams;

  if (req.query.sort) {
    search = req.session.search;
    searchParams = req.session.searchParams;
    sort = req.query.sort;
  } else {
    search = formatSearch(req.query.search);
    searchParams = getSearchParams(search);
    sort = req.session.sort || 'name ASC';
  }

  sort = formatSortParams(sort);

  sequelize.transaction(t => {
    return Product.findAll({
      where: searchParams,
      include: [{ model: Category }],
      order: sort.array,
      transaction: t
    })
      .then(result => {
        products = result;
        let cart = req.session.cart;
        products = checkCartContent(products, cart.items);

        return Category.findAll({
          transaction: t
        });
      })
      .then(result => {
        categories = result;
        req.session.search = search;
        req.session.searchParams = searchParams;
        req.session.sort = sort.string;

        res.render('products/index', {
          products,
          categories,
          filterCategory: search.category,
          productQuery: search.name,
          minPrice: search.minPrice,
          maxPrice: search.maxPrice,
          currentSort: sort.string
        });
      })
      .catch(e => {
        if (e.errors) {
          e.errors.forEach(err => req.flash('error', err.message));
          res.redirect('back');
        } else {
          res.status(500).send(e.stack);
        }
      });
  });
});

router.get('/:id', (req, res) => {
  let product;
  let relatedProducts;

  sequelize.transaction(t => {
    return Product.findById(req.params.id, {
      include: [{ model: Category }],
      transaction: t
    })
      .then(result => {
        product = result;
        let cart = req.session.cart;
        product = checkCartContent([product], cart.items)[0];

        if (product) {
          return Product.findAll({
            where: {
              categoryId: product.categoryId,
              id: { $ne: product.id }
            },
            include: [{ model: Category }],
            transaction: t
          });
        } else {
          res.send(404);
        }
      })
      .then(result => {
        relatedProducts = result;
        let cart = req.session.cart;
        relatedProducts = checkCartContent(relatedProducts, cart.items);

        res.render('products/show', {
          product,
          relatedProducts
        });
      })
      .catch(e => {
        if (e.errors) {
          e.errors.forEach(err => req.flash('error', err.message));
        } else {
          res.status(500).send(e.stack);
        }
      });
  });
});

module.exports = router;
