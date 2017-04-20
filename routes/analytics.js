const express = require("express");
const router = express.Router();

const sqlModels = require("./../models/sequelize");
const sequelize = sqlModels.sequelize;

const { Product, Category } = sqlModels;

const mongoose = require("mongoose");
const mongoModels = require("./../models/mongoose");
const Order = mongoose.model("Order");

router.get("/", (req, res) => {
  Order.find({})
    .then(orders => {
      res.render("analytics/index", { orders });
    });
});

module.exports = router;
