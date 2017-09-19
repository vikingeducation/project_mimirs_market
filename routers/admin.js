const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = mongoose.model("Order");
const OrderItem = mongoose.model("OrderItem");

router.get("/orders", (req, res) => {
  Order.find().then(orders => {
    res.render("admin/orders/index", { orders });
  });
});

router.get("/orders/show/:id", (req, res) => {
  Order.findById(req.params.id).populate("items").then(order => {
    res.render("admin/orders/show", { order });
  });
});

router.get("/analytics", (req, res) => {
  res.render("admin/analytics/analytics");
});

module.exports = router;
