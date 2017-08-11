const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Product } = require("../models/sequelize");
const { Order, OrderItem } = require("../models/mongoose");

//render checkout form
router.get("/", (req, res) => {
  res.render("checkout/form");
});

//collect cart items, determine quantity and order total,
//create order, save order to database
router.post("/info", (req, res) => {
  let total = 0;
  let orderItems;
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
      return {
        firstName: req.body.info.firstName,
        lastName: req.body.info.lastName,
        email: req.body.info.email,
        description: req.body.info.description,
        total: total,
        streetAddress: req.body.info.address,
        city: req.body.info.city,
        state: req.body.info.state,
        checkoutDate: new Date(),
        items: orderItems
      };
    })
    .then(order => {
      let newOrder = new Order(order);
      let promises = [];
      orderItems.forEach(order => {
        promises.push(order.save());
      });
      promises.push(newOrder.save());
      return Promise.all(promises);
    })
    .then(() => {
      req.session.infoComplete = true;
      res.redirect("/checkout/payment");
    });
});

router.get("/payment", (req, res) => {
  res.end("time to pay!");
});

module.exports = router;
