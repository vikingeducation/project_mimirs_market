const express = require("express");
const router = express.Router();
const { STRIPE_SK, STRIPE_PK } = process.env;
const stripe = require("stripe")(STRIPE_SK);
const getCartInfo = require("./../lib/getCartInfo");
const mongooseModels = require("./../models/mongoose");
const Order = mongoose.models("Order");
const OrderItem = mongoose.models("OrderItem");

router.post("/", (req, res) => {
  const charge = req.body;
  const items = getCartInfo(req.session.cart);
  let fname = req.body.fname;
  let lname = req.body.lname;
  let email = req.body.email;
  let street = req.body.street;
  let city = req.body.city;
  let state = req.body.state;
  stripe.charges
    .create({
      amount: items.total,
      currency: "usd",
      description: "test charge",
      source: charge.stripeToken
    })
    .then(result => {
      let orderItems = [];
      items.forEach(item => {
        item = new OrderItem({});
      });
      let order = new Order({
        cardType: result.source.brand,
        total: result.total,
        fname,
        lname,
        email,
        street,
        city,
        state
      });
    });
});

module.exports = router;
