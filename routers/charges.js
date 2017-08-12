const express = require("express");
const router = express.Router();
// const models = require("./../models/sequelize");
// const Product = models.Product;
// const Category = models.Category;
const {ProductsHelpers, CartHelpers} = require("../helpers");

// Set up stripe
const {STRIPE_SK, STRIPE_PK} = process.env;

const stripe = require("stripe")(STRIPE_SK);
const mongoose = require("mongoose");
const models = require("./../models/mongoose");
const {Charge, Order, OrderItem} = models;

router.get('/', (req, res) => {
  res.render("charges", {STRIPE_PK});
})

router.post('/', (req, res) => {
  const order = req.session.order;
  const cart = req.session.cart;
  const charge = req.body;

  let totalPrice = cart.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0)

  stripe.charges.create({
    amount: totalPrice,
    currency: 'usd',
    description: "wow, what a steal of a buy. Great transaction!",
    source: charge.stripeToken
  })
  .then((result) => {
    let charge = new Charge({
      chargeId: result.id,
      amount: result.amount,
      description: result.description,
      currency: result.currency
    })

    let orderItems = cart.map((orderItem) => {
      return new OrderItem({
        productId: orderItem.productId,
        name: orderItem.name,
        sku: "test",
        category: orderItem.category,
        quantity: orderItem.quantity,
        price: orderItem.price
      }).save()
    })

    let orderArray = [charge.save(), Promise.all(orderItems)]
    return Promise.all(orderArray);
  })
  .then((orderArray) => {
    let orderNew = new Order({
      firstName: order.personal.firstName,
      lastName: order.personal.lastName,
      email: order.personal.email,
      street: order.address.street,
      city: order.address.city,
      state: order.address.state,
      items: orderArray[1],
      charge: orderArray[0]
    })

    return orderNew.save();
  })
  .then((orderFulfilled) => {
    console.log(orderFulfilled);
    return res.render("success")
  })
  .catch((e) => res.status(500).send(e.stack));})

  module.exports = router;
