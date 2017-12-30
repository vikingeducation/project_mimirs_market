const express = require('express');
const models = require('./../models/sequelize');
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
    sort = 'name ASC';
  }

  sort = formatSortParams(sort);
  console.log(searchParams);

  sequelize.transaction(t => {
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
        req.session.searchParams = searchParams;

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

module.exports = router;
