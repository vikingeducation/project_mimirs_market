const express = require('express');
const router = express.Router();
const models = require('./../models/sequelize');
const Product = models.Product;
const Category = models.Category;
const { 
  parseQuery,
  setDefaults,
  formatQuery
} = require('./../helpers/search-helpers');
const h = require('./../helpers/path-helpers').registered;
const sequelize = models.sequelize;

router.get('/', (req, res) => {
  let products;
  let categories;
  let search;
  let formattedSearch;
  let sort;

  if (req.query.sort) {
    search = req.session.search;
    formattedSearch = req.session.formattedSearch;
    sort = req.query.sort;
  } else {
    search = parseQuery(req.query.search);
    search = setDefaults(search);
    formattedSearch = formatQuery(search);
    sort = 'name ASC';
  }

  sequelize.transaction(t => {
    return Product.findAll({
      where: formattedSearch,
      include: [{model: Category}],
      order: sequelize.literal(sort),
      transaction: t
    })
      .then(results => {
        products = results;
        return Category.findAll({
          transaction: t
        });
      })
      .then(results => {
        categories = results;
        req.session.search = search;
        req.session.formattedSearch = formattedSearch;
        res.render('products/index', {
          products,
          categories,
          productName: search.name,
          minPrice: search.minPrice,
          maxPrice: search.maxPrice
        });
      })
      .catch(e => {
      if (e.errors) {
        e.errors.forEach((err) => req.flash('error', err.message));
        res.redirect('back');
      } else {
        res.status(500).send(e.stack);
      }
    });
  });
});

router.get('/:id', (req, res) => {
  let currentProduct;
  let relatedProducts;
  Product.findById(req.params.id, {
    include: { model: Category }
  })
    .then(result => {
      currentProduct = result;
      return Product.findAll({
        where: { categoryId: result.categoryId },
        include: { model: Category },
        limit: 6
      });
    })
    .then(results => {
      relatedProducts = results;
      res.render('products/show', {
        currentProduct,
        relatedProducts
      });
    })
    .catch(e => {
      if (e.errors) {
        e.errors.forEach((err) => req.flash('error', err.message));
        res.redirect('back');
      } else {
        res.status(500).send(e.stack);
      }
    });
});

module.exports = router;