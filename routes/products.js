var express = require('express');
var router = express.Router();
var models = require('./../models/sequelize');
var sequelize = models.sequelize;
var Product = models.Product;
var Category = models.Category;

let productIndex = function(req, res, next) {
  let criteria = {
    include: [{
      model: Category
    }]
  };

  if (req.method === 'POST') {
    if (req.body._action === 'SEARCH') {
      criteria.where = {
        $or: [{
            'name': {
              $iLike: '%' + req.body.searchText + '%'
            }
          },
          {
            'description': {
              $iLike: '%' + req.body.searchText + '%'
            }
          }
        ]
      };
      /* This is not working.  I think it's something tied to using v4 of Sequelize
      criteria.include = [{
        model: Category,
        through: {
          where: {
            'name': '%' + req.body.searchText + '%'
          }
        }
      }]; */
    }
    if (req.body._action === 'FILTER') {
      criteria.where = {
        $and: [{
            '"categoryID"': req.body.categoryFilter || {
              $gte: 0
            }
          },
          {
            'price': {
              $gte: req.body.minPriceFilter || 0,
              $lte: req.body.maxPriceFilter || 1000000
            }
          }
        ]
      }
      switch (req.body.orderBy) {
        case "prodNameDesc":
          criteria.order = [
            ['name', 'DESC']
          ];
          break;
        case "prodPriceAsc":
          criteria.order = [
            ['price', 'ASC']
          ];
          break;
        case "prodPriceDesc":
          criteria.order = [
            ['price', 'DESC']
          ];
          break;
        case "prodNew":
          criteria.order = [
            ['createdAt', 'ASC']
          ];
          break;
        case "prodOld":
          criteria.order = [
            ['createdAt', 'DESC']
          ];
          break;
        default:
          criteria.order = sequelize.col('name');
      }
    }
  };

  console.log(criteria);

  Product.findAll(criteria)
    .then((products) => {
      Category.findAll({
          order: sequelize.col('name')
        })
        .then((categories) => {
          Product.min('price')
            .then((min_price) => {
              Product.max('price')
                .then((max_price) => {
                  let prices = [];
                  let price_step = Math.floor((max_price -
                    min_price) / 5);
                  for (let i = 0; i < 4; i++) {
                    prices.push(Math.floor(min_price + price_step *
                      i));
                  }
                  prices.push(Math.ceil(max_price));
                  res.render('index', {
                    title: "Mimir's Market",
                    products: products,
                    categories: categories,
                    prices: prices
                  });
                })
            })
        })
    })
    .catch((e) => res.status(500)
      .send(e.stack));
};

/* GET home page. */
router.get('/', productIndex);

// needs to be populated for addToCart button, but placeholder for now
router.post('/', productIndex);

module.exports = router;
