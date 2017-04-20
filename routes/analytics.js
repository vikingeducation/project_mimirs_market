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
      res.render("analytics/index", { orders });
    })
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  Order.findById(req.params.id)
    .then(order => {
      console.log(order);
      res.render('analytics/show', { order });
    })
    .catch(next);
});

router.get('/revenue', (req, res, next) => {
  res.render('analytics/revenue');
});

module.exports = router;
