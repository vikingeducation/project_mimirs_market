var express = require("express");
var router = express.Router();
const { Product, Category, State } = require("../models/sequelize");

//checkout route
router.get("/", (req, res) => {
  let states = getStates();
  states
    .then(stateList => {
      return res.render("cart/checkout", {
        cart: req.session.cart,
        states: stateList,
        total: getTotal(req.session.cart)
      });
    })
    .catch(e => {
      console.log(`TERRIBLE THINGS HAVE HAPPENED: ${e}`);
      throw e;
    });
});

module.exports = router;

//util functions
function getTotal(cart) {
  return cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
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
