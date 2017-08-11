var express = require("express");
var router = express.Router();
const { Product, Category, State } = require("../models/sequelize");
let stripe = require("stripe")(process.env.STRIPE_SK);

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
router.post("/charges", (req, res) => {
  var charge = req.body;
  stripe.charges
    .create({
      amount: 100,
      currency: "usd",
      description: "/* Some description of the transaction */",
      source: charge.stripeToken
    })
    .then(charge => {
      // ... Save charge and session data
      // from checkout and cart
      // to MongoDB
      return res.render("cart/success");
    })
    .then(() => {
      // Redirect or render here
      // return res.render("cart/success");
    })
    .catch(e => res.status(500).send(e.stack));
});

module.exports = router;

//util functions
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
