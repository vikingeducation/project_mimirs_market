var models = require('./../models/sequelize');
var sequelize = models.sequelize;
var Product = models.Product;
var Category = models.Category;
var Cart = require('./cart');


module.exports.productIndex = function(req, res, next) {

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

  if (req.session.cart === undefined) req.session.cart = [];

  Product.findAll(criteria)
    .then((products) => {
      let cartList = Cart.cartItemsList(req);
      products.forEach(function(item, index, array) {
        item.inCart = cartList.includes(item.id.toString());
      });
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
                  res.render('product/index', {
                    title: "Mimir's Market",
                    products: products,
                    categories: categories,
                    cart_count: req.session.cart.length || 0,
                    prices: prices
                  });
                })
            })
        })
    })
    .catch((e) => res.status(500)
      .send(e.stack));
};

module.exports.productDetail = function(req, res, next) {

  let criteria = {
    include: [{
      model: Category
    }]
  };

  Product.findById(req.params.productID, criteria)
    .then((productDetail) => {
      let cartList = Cart.cartItemsList(req);

      productDetail.inCart = cartList.includes(productDetail.id.toString());

      let categoryCriteria = {
        where: {
          '"categoryID"': productDetail.categoryID
        },
        include: [{
          model: Category
        }]
      }
      Product.findAll(categoryCriteria)
        .then((related) => {
          related.forEach(function(item, index, array) {
            item.inCart = cartList.includes(item.id.toString());
          });
          res.render('product/detail', {
            title: "Mimir's Market",
            product: productDetail,
            cart_count: req.session.cart.length || 0,
            related: related
          });
        })

    })
};
