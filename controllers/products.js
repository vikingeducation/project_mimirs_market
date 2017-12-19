const express = require('express');
const models = require('./../models/sequelize');
const { formatSearchParams } = require('./../helpers/params_helper');

const router = express.Router();
const sequelize = models.sequelize;
const Product = models.Product;
const Category = models.Category;

router.get('/', (req, res) => {
  let products;
  let categories;

  sequelize
    .transaction(t => {
      return Product.findAll({
        include: [{ model: Category }],
        transaction: t
      })
        .then(result => {
          products = result;

          return Category.findAll({
            transaction: t
          });
        })
        .then(result => {
          categories = result;
          res.render('products/index', {
            products,
            categories
          });
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

router.post('/', (req, res) => {
  let products;
  let categories;
  let search;

  if (req.body.search.filter) {
    search = req.body.search;
  } else {
    search = req.session.search;
  }

  let { searchParams, sort } = formatSearchParams(search, req);

  const minPrice = search.filter.minPrice || 0;
  const maxPrice = search.filter.maxPrice || 1000;
  const filterCategory = search.filter.category;

  sequelize
    .transaction(t => {
      return Product.findAll({
        where: searchParams,
        include: [{ model: Category }],
        order: sort.array,
        transaction: t
      })
        .then(result => {
          products = result;

          return Category.findAll({
            transaction: t
          });
        })
        .then(result => {
          categories = result;
          req.session.search = search;
          // req.session.searchParams = searchParams;
          req.session.sort = sort;
          res.render('products/index', {
            products,
            categories,
            filterCategory,
            minPrice,
            maxPrice,
            currentSort: sort.string
          });
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

router.post('/sort', (req, res) => {});

module.exports = router;
