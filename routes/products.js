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
// const h = require('./../helpers/path-helpers').registered;
const sequelize = models.sequelize;

router.get('/', (req, res) => {

  // So here is what we need to do first
  // There are multiple stages
  // check if Object.hasKey sort of req query
  // if yes, search is cookies last search 
  // if no sort, we parse the query. EVEN IF IT'S EMPTY
  // so basically let search = parseQuery(req.query);
  //    this fills in blanks for all categories where none where provided
  //    so something like Object.keys(req.query) if none then category="" or whatevs
  // THEN we do search = setDefaultsWhereEmpty(search);
  // then we begin our chain of querying sequelize
  // voila

  // search fields:
  // category
  // price min price max
  // 
  // console.log('#######')
  // console.log(req.query.search.hasOwnProperty("name"));
  // console.log('#######')
  let products;
  let categories;
  let search = parseQuery(req.query.search);
  search = setDefaults(search);
  let formattedSearch = formatQuery(search);

  sequelize.transaction(t => {
    return Product.findAll({
      where: formattedSearch,
      include: [{model: Category}],
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