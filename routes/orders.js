const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const mongoModels = require("./../models/mongoose");
const Order = mongoose.model("Order");

router.get("/", (req, res, next) => {
  Order.find({})
    .then(orders => {
      res.render("orders/index", { orders });
    })
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  Order.findById(req.params.id)
    .then(order => {
      console.log(order);
      res.render('orders/show', { order });
    })
    .catch(next);
});

module.exports = router;
