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
  console.log(session);
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

router.post("/", (req, res) => {
  const items = getCartInfo(req.session.cart);
  console.log(req.session);
  const customer = makeCustomer(req.session);
  const purchases = makeItems(items.cartItems);
  let orderItems = [];
  let brand;
  let total;
  let order = new Order();
  order.customer = customer;
  order.orderItems = [];
  console.log(order);
  purchases.forEach(purchase => {
    let orderItem = new OrderItem(purchase);
    orderItems.push(orderItem.save());
  });
  Promise.all(orderItems)
    .then(results => {
      results.forEach(result => {
        order.orderItems.push(result._id);
      });
      return order.save();
    })
    .then(result => {
      console.log(result);
    });
    .catch(e=> res.status(500).end(e.stack))
  // stripe.charges
  //   .create({
  //     amount: items.total,
  //     currency: "usd",
  //     description: "test charge",
  //     source: charge.stripeToken
  //   })
  //   .then(charge => {
  //     brand = charge.source.brand;
  //     total = charge.total;
  //   });
  // let orderItems = [];
  // purchases.forEach(purchase => {
  //   orderItem = new OrderItem(purchase);
  //   orderItems.push(orderItem);
  // });
  // (order.cardType = brand), (order.total = total), (order.orderItems = orderItems);
  // order.save();
  // res.redirect("/");
});

//       return result;
//     });
//   let purchases = [];
//   items.cartItems.forEach(item => {
//     item = new OrderItem({
//       id: item.id,
//       name: item.name,
//       price: item.price,
//       sku: item.sku,
//       description: item.description,
//       category: item.category,
//       quantity: item.quantity
//     });
//     purchases.push(item);
//   });
//   let order = new Order({
//     // cardType: result.source.brand,
//     // total: result.total,
//     orderItems: purchases,
//     fname: firstName,
//     lname: lastName,
//     email: custEmail,
//     street: req.body.street,
//     city: req.body.city,
//     state: req.body.state
//   });
//   console.log(order);
// });

module.exports = router;
