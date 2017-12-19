const express = require('express');
const models = require('./../models/sequelize');
const {
  formatSearchParams,
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

  // if (req.session.sort) {
  //   sort = req.session.sort;
  // } else {
  //   sort = {
  //     array: [['name', 'ASC']],
  //     string: 'name ASC'
  //   };
  // }

  sequelize
    .transaction(t => {
      return Product.findAll({
        include: [{ model: Category }],
        // order: sort.array,
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
            // currentSort: sort.string
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
  // let sort;
  const search = req.body.search;
  console.log(req.session.sort);
  let { searchParams, sort } = formatSearchParams(search);

  const minPrice = search.minPrice || 0;
  const maxPrice = search.maxPrice || 1000;
  const filterCategory = search.category;
  // const currentSort = sort.string;

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
          // req.session.search = search;
          // req.session.searchParams = searchParams;
          req.session.sort = sort;
          res.render('products/index', {
            products,
            categories,
            filterCategory,
            minPrice: search.minPrice,
            maxPrice: search.maxPrice,
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
