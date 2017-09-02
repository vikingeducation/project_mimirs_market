const express = require("express");
const router = express.Router();
const { STRIPE_SK, STRIPE_PK } = process.env;
const stripe = require("stripe")(STRIPE_SK);
const getCartInfo = require("./../lib/getCartInfo");
const mongoose = require("mongoose");
var models = require("./../models/mongoose");
var Order = mongoose.model("Order");
var OrderItem = mongoose.model("OrderItem");

const makeCustomer = session => {
  let customer = {
    fname: session.fname,
    lname: session.lname,
    email: session.email,
    street: session.street,
    city: session.city,
    state: session.state
  };
  return customer;
};

const makeItems = items => {
  let purchases = [];
  items.forEach(item => {
    let itemObj = {
      id: item.id,
      name: item.name,
      price: item.price,
      sku: item.sku,
      description: item.description,
      category: item.category,
      quantity: item.quantity
    };
    purchases.push(itemObj);
  });
  return purchases;
};

router.post("/", async (req, res) => {
  const items = getCartInfo(req.session.cart);
  const customer = makeCustomer(req.session);
  const purchases = makeItems(items.cartItems);
  let charge = req.body;
  let thisCharge = await stripe.charges.create({
    amount: items.total,
    currency: "usd",
    description: "test charge",
    source: charge.stripeToken
  });
  let brand;
  let total;
  let orderItems = [];
  let order = new Order({
    customer
  });
  order.total = thisCharge.amount;
  order.transactionID = thisCharge.balance_transaction;
  order.cardType = thisCharge.source.brand;
  purchases.forEach(purchase => {
    let orderItem = new OrderItem(purchase);
    orderItems.push(orderItem.save());
  });
  let promisedItems = await Promise.all(orderItems);
  order.orderItems = promisedItems;
  let savedOrder = await order.save();
  res.redirect("/");
});

module.exports = router;
