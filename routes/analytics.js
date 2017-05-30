const express = require("express");
const router = express.Router();

const sqlModels = require("./../models/sequelize");
const sequelize = sqlModels.sequelize;

const { Product, Category } = sqlModels;

const mongoose = require("mongoose");
const mongoModels = require("./../models/mongoose");
const Order = mongoose.model("Order");

router.get("/", (req, res, next) => {
  Order.find({})
    .then(orders => {
      console.log(orders[0]);
      res.render("analytics/index", { orders });
    })
    .catch(next);
});

router.get("/revenue", (req, res, next) => {
  let states;
  let categories;
  let products;
  let totals = {};
  Order.aggregate([
    { $group: { _id: "$state", total: { $sum: "$total" } } },
    { $sort: { total: -1 } }
  ])
    .then(statesList => {
      states = statesList;
      return Order.aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.category",
            total: {
              $sum: { $multiply: ["$products.price", "$products.quantity"] }
            }
          }
        },
        { $sort: { total: -1 } }
      ]);
    })
    .then(cat => {
      categories = cat;
      return Order.aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.name",
            total: {
              $sum: { $multiply: ["$products.price", "$products.quantity"] }
            }
          }
        },
        { $sort: { total: -1 } }
      ]);
    })
    .then(prod => {
      products = prod;
      return Order.aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: "$_id",
            total: {
              $sum: "$products.quantity"
            }
          }
        },
        { $sort: { total: -1 } }
      ]);
    })
    .then(orders => {
      console.log(orders);
      totals.states = states.length;
      totals.categories = categories.length;
      totals.products = products.length;
      totals.orders = orders.length;
      totals.units = orders.reduce(
        function(acc, val) {
          return acc + val.total;
        },
        0
      );
      totals.revenue = categories.reduce(
        function(acc, val) {
          return acc + val.total;
        },
        0
      );
      res.render("analytics/revenue", { states, categories, products, totals });
    })
    .catch(next);
});

router.get("/:id", (req, res, next) => {
  Order.findById(req.params.id)
    .then(order => {
      console.log(order);
      res.render("analytics/show", { order });
    })
    .catch(next);
});

module.exports = router;
