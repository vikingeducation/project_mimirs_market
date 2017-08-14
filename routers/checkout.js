const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Product } = require("../models/sequelize");
const { Order, OrderItem } = require("../models/mongoose");
const { STRIPE_SK, STRIPE_PK } = process.env;
const stripe = require("stripe")(STRIPE_SK);

//render checkout form
router.get("/", (req, res) => {
  res.render("checkout/form");
});

//collect cart items, determine quantity and order total,
//create order, save order to database
router.post("/info", (req, res) => {
  req.session.pendingInfo = {
    firstName: req.body.info.firstName,
    lastName: req.body.info.lastName,
    email: req.body.info.email,
    description: req.body.info.description,
    streetAddress: req.body.info.address,
    city: req.body.info.city,
    state: req.body.info.state,
    checkoutDate: new Date()
  };
  req.session.infoComplete = true;
  res.redirect("/checkout/payment");
});

router.get("/payment", (req, res) => {
  res.render("checkout/payment");
});

router.post("/charges", (req, res) => {
  let total = 0;
  let orderItems;
  let order;
  let charge = req.body;
  let newOrder;
  let cart = req.session.cart.map(el => el.id);
  Product.findAll({
    where: { id: { $in: cart } },
    include: [{ all: true, nested: true }]
  })
    .then(items => {
      items.forEach((p, pix) => {
        req.session.cart.forEach((i, cix) => {
          if (p.id * 1 === i.id * 1) {
            p.quantity = i.quantity;
            total += i.quantity * p.price;
          }
        });
      });
      return items;
    })
    .then(items => {
      orderItems = items.map(i => {
        return new OrderItem({
          name: i.name,
          price: i.price,
          sku: i.sku,
          description: i.description,
          category: i.Category.name,
          quantity: i.quantity
        });
      });
      order = req.session.pendingInfo;
      order.items = orderItems;
      order.total = total;
      newOrder = new Order(order);
      stripe.charges.create({
        amount: total,
        currency: "usd",
        description: order.description,
        source: charge.stripeToken
      });
    })
    .then(charge => {
      newOrder.cardType = req.body.stripeTokenType;
      newOrder.StripeToke = req.body.stripeToken;
      let promises = [];
      orderItems.forEach(item => {
        promises.push(item.save());
      });
      promises.push(newOrder.save());
      return Promise.all(promises);
    })
    .then(() => {
      req.session = { cart: [], backUrl: "/" };
      res.render("development/end", { orderItems, newOrder });
    })
    .catch(e => res.status(500).send(e.stack));
});

module.exports = router;
