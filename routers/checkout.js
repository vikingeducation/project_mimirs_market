var express = require("express");
var router = express.Router();

//stripe
let stripe = require("stripe")(process.env.STRIPE_SK);
//sequelize
const { Product, Category, State } = require("../models/sequelize");
//mongoose
const mongoose = require("mongoose");
let models = require("./../models/mongoose");
let Order = models.Order;
let OrderItem = models.OrderItem;

//checkout route
router.get("/", (req, res) => {
  let states = getStates();
  states
    .then(stateList => {
      return res.render("cart/checkout", {
        cart: makeCart(req.session.cart),
        states: stateList,
        total: getTotal(req.session.cart),
        STRIPE_PK: process.env.STRIPE_PK
      });
    })
    .catch(e => {
      console.log(`TERRIBLE THINGS HAVE HAPPENED: ${e}`);
      throw e;
    });
});

//
router.post("/", (req, res) => {
  //add the form data to the session?
  var token = req.body.stripeToken;
  stripe.charges
    .create({
      amount: getTotal(req.session.cart),
      currency: "usd",
      description: "Purchased Tons of Heads from Mimir's Market",
      source: token
    })
    .then(charge => {
      // ... Save charge and session data
      // from checkout and cart
      // to MongoDB
      console.log(`charge = ${charge}`);
      let order = new Order({
        user: {
          fname: req.body.user.fname,
          lname: req.body.user.lname,
          email: req.body.user.email,
          street: req.body.user.street,
          city: req.body.user.city,
          state: req.body.user.state
        },
        items: makeItems(req.session.cart),
        stripe: {
          id: charge.id,
          amount: charge.amount,
          balanceTransaction: charge["balance_transaction"],
          createdAt: charge.created,
          cardType: charge.source.brand
        }
      });
      return order.save();
    })
    .then(() => {
      // Redirect or render here
      return res.render("cart/success");
    })
    .catch(e => res.status(500).send(e.stack));
});

//Stripe submit route
router.get("/charges", (req, res) => {
  // var charge = req.body;
  // stripe.charges
  //   .create({
  //     amount: 100,
  //     currency: "usd",
  //     description: "/* Some description of the transaction */",
  //     source: charge.stripeToken
  //   })
  //   .then(charge => {
  //     // ... Save charge and session data
  //     // from checkout and cart
  //     // to MongoDB
  //
  //     let order = new Order({});
  //     return order.save();
  //   })
  //   .then(() => {
  //     // Redirect or render here
  //     return res.render("cart/success");
  //   })
  //   .catch(e => res.status(500).send(e.stack));
  return res.render("cart/success");
});

module.exports = router;

//util functions
//////convert session items into an arr of OrderItems
let makeItems = function(cart) {
  let items = [];
  for (var item in cart) {
    let oI = new OrderItem({
      productId: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      quantity: item.quantity
    });
    oI.save();
    items.push(oI);
  }
  return items;
};
function getTotal(cart) {
  return cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
}
//not needed anymore?
// function getSubtotals(cart) {
//   return cart.map(item => {
//     return item.price * item.quantity;
//   });
// }
//make a new obj to pass to my checkout view that includes the subtotal
//assuming that items aren't deeply nested
function makeCart(cart) {
  //make a copy of the cart
  let newCart = cart.map(item => {
    let newItem = {};
    Object.keys(item).forEach(key => {
      newItem[key] = item[key];
    });
    //add the subtotals
    newItem["subtotal"] = newItem.price * newItem.quantity;
    return newItem;
  });
  return newCart;
}
function getStates() {
  return new Promise(resolve => {
    State.findAll({}).then(states => {
      return resolve(
        states.map(model => {
          return model.name;
        })
      );
    });
  });
}
