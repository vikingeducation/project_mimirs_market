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
    Category.findAll({}).then(categorys => {
      Product.findAll({
        include: [Category]
      }).then(products => {
        res.render("search/start", { products, categorys });
      });
    });
  });

  router.post("/filter", (req, res) => {
    var sortOrder = sortAndOrder(req.body.sort);
    var searchText = "%" + req.body.search + "%";
    if (req.body.filter.category === "any" && searchText === "%%") {
      Category.findAll({}).then(categorys => {
        Product.findAll({
          include: [{ model: Category }],
          where: {
            price: {
              $and: [
                {
                  $lte: req.body.filter.priceMax
                },
                {
                  $gte: req.body.filter.priceMin
                }
              ]
            }
          },
          order: [[sortOrder.orderItem, sortOrder.sort]]
        }).then(products => {
          res.render("search/start", { products, categorys });
        });
      });
    } else if (searchText === "%%") {
      Category.findAll({}).then(categorys => {
        Product.findAll({
          include: [
            {
              model: Category,
              where: {
                name: req.body.filter.category
              }
            }
          ],
          where: {
            price: {
              $and: [
                {
                  $lte: req.body.filter.priceMax
                },
                {
                  $gte: req.body.filter.priceMin
                }
              ]
            }
          },
          order: [[sortOrder.orderItem, sortOrder.sort]]
        }).then(products => {
          res.render("search/start", { products, categorys });
        });
      });
    } else if (req.body.filter.category === "any") {
      Category.findAll({}).then(categorys => {
        Product.findAll({
          include: [{ model: Category }],
          where: {
            price: {
              $and: [
                {
                  $lte: req.body.filter.priceMax
                },
                {
                  $gte: req.body.filter.priceMin
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
          res.render("search/start", { products, categorys });
        });
      });
    } else {
      Category.findAll({}).then(categorys => {
        Product.findAll({
          include: [
            {
              model: Category,
              where: {
                name: req.body.filter.category
              }
            }
          ],
          where: {
            price: {
              $and: [
                {
                  $lte: req.body.filter.priceMax
                },
                {
                  $gte: req.body.filter.priceMin
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
          res.render("search/start", { products, categorys });
        });
      });
    }
  });

  return router;
};
