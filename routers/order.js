var express = require("express");
var router = express.Router();

//mongoose
const mongoose = require("mongoose");
let models = require("./../models/mongoose");
let Order = models.Order;
let OrderItem = models.OrderItem;

//index
router.get("/", (req, res) => {
  getOrders().then(orders => {
    res.render("orders/index", { orders });
  });
});

//show route
router.get("/:id", (req, res) => {
  Order.find({
    "stripe.id": req.params.id
  })
    .populate("items")
    .then(order => {
      // if (err) throw err;
      let items = order.items;
      console.log(order);
      console.log(items);
      res.render("orders/show", { items });
    });
});

//testing commands
// Order.find({
//   "stripe.id": "ch_1Apk9TBuV8KjfIHkvNhcywRK"
// })
//   .populate("items")
//   .then(order => {
//     console.log(order);
//   });

module.exports = router;

//utils

//get all orders
let getOrders = async function() {
  return Order.find().populate("items");
};
