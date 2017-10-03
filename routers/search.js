var express = require("express");
var router = express.Router();
var models = require("../models/sequelize");
var Product = models.Product;
var Category = models.Category;
var sequelize = models.sequelize;

var sortAndOrder = function(sortStr) {
  var sort;
  var orderItem;
  if (sortStr.charAt(sortStr.length - 3) === "A") {
    sort = "ASC";
    orderItem = sortStr.substring(0, sortStr.length - 3);
  } else {
    sort = "DESC";
    orderItem = sortStr.substring(0, sortStr.length - 4);
  }
  return { sort, orderItem };
};

module.exports = app => {
  router.get("/", (req, res) => {
    Product.findAll({
      where: {
        id: req.session.cart
      }
    }).then(cart => {
      res.locals.cart = cart;
      res.locals.cartQuanity = req.session.cartQuanity;
      res.locals.cookieCart = req.session.cart;
      Category.findAll({}).then(categorys => {
        Product.findAll({
          include: [Category]
        }).then(products => {
          var searched;
          res.render("search/start", { products, categorys, searched });
        });
      });
    });
  });

  router.post("/filter", (req, res) => {
    var searched = {
      search: req.body.search,
      filter: {
        category: req.body.filter.category,
        priceMin: req.body.filter.priceMin,
        priceMax: req.body.filter.priceMax
      },
      sort: req.body.sort
    };
    Product.findAll({
      where: {
        id: req.session.cart
      }
    }).then(cart => {
      res.locals.cart = cart;
      res.locals.cartQuanity = req.session.cartQuanity;
      res.locals.cookieCart = req.session.cart;
      var sortOrder = sortAndOrder(searched.sort);
      var searchText = "%" + searched.search + "%";
      if (searched.filter.category === "any" && searchText === "%%") {
        Category.findAll({}).then(categorys => {
          Product.findAll({
            include: [{ model: Category }],
            where: {
              price: {
                $and: [
                  {
                    $lte: searched.filter.priceMax
                  },
                  {
                    $gte: searched.filter.priceMin
                  }
                ]
              }
            },
            order: [[sortOrder.orderItem, sortOrder.sort]]
          }).then(products => {
            res.render("search/start", { products, categorys, searched });
          });
        });
      } else if (searchText === "%%") {
        Category.findAll({}).then(categorys => {
          Product.findAll({
            include: [
              {
                model: Category,
                where: {
                  name: searched.filter.category
                }
              }
            ],
            where: {
              price: {
                $and: [
                  {
                    $lte: searched.filter.priceMax
                  },
                  {
                    $gte: searched.filter.priceMin
                  }
                ]
              }
            },
            order: [[sortOrder.orderItem, sortOrder.sort]]
          }).then(products => {
            res.render("search/start", { products, categorys, searched });
          });
        });
      } else if (searched.filter.category === "any") {
        Category.findAll({}).then(categorys => {
          Product.findAll({
            include: [{ model: Category }],
            where: {
              price: {
                $and: [
                  {
                    $lte: searched.filter.priceMax
                  },
                  {
                    $gte: searched.filter.priceMin
                  }
                ]
              },
              $or: [
                { name: { $iLike: searchText } },
                { description: { $iLike: searchText } },
                sequelize.literal(
                  `"Category"."name" ILIKE ${"'" + searchText + "'"}`
                )
              ]
            },
            order: [[sortOrder.orderItem, sortOrder.sort]]
          }).then(products => {
            res.render("search/start", { products, categorys, searched });
          });
        });
      } else {
        Category.findAll({}).then(categorys => {
          Product.findAll({
            include: [
              {
                model: Category,
                where: {
                  name: searched.filter.category
                }
              }
            ],
            where: {
              price: {
                $and: [
                  {
                    $lte: searched.filter.priceMax
                  },
                  {
                    $gte: searched.filter.priceMin
                  }
                ]
              },
              $or: [
                { name: { $iLike: searchText } },
                { description: { $iLike: searchText } },
                sequelize.literal(
                  `"Category"."name" ILIKE ${"'" + searchText + "'"}`
                )
              ]
            },
            order: [[sortOrder.orderItem, sortOrder.sort]]
          }).then(products => {
            res.render("search/start", { products, categorys, searched });
          });
        });
      }
    });
  });

  return router;
};
