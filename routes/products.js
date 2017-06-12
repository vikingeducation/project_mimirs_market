const url = require('url');
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
    search = req.cookies.search;
    formattedSearch = req.cookies.formattedSearch;
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
        res.cookie("search", search);
        res.cookie("formattedSearch", formattedSearch);
        res.render('products/index', {
          products,
          categories,
          productName: search.name,
          minPrice: search.minPrice,
          maxPrice: search.maxPrice
        });
      });
  });
});

module.exports = router;