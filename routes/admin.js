const express = require("express");
const router = express.Router();
var mongoose = require("mongoose");
var modelsMon = require("./../models/mongoose");
var Order = mongoose.model("Order");

router.get("/", (req, res) => {
  var cartProducts = req.session.shoppingCart;
  Order.find({})
    .sort({ createdAt: -1 })
    .then(orders => {
      res.render("admin/index", { orders, cartProducts });
    })
    .catch(() => res.status(500).send(e.stack));
});

router.get("/:id", (req, res) => {
  var cartProducts = req.session.shoppingCart;
  Order.findById(req.params.id)
    .then(order => {
      var adminProducts = order.shoppingCart;
      res.render("admin/show", { order, adminProducts, cartProducts });
    })
    .catch(() => res.status(500).send(e.stack));
});

module.exports = router;
