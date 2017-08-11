const cartBuilder = require("./sessionBuilder");

const getCartInfo = session => {
  let cart = {};
  cart.cartItems = cartBuilder(session);
  cart.total = 0;
  cart.cartItems.forEach(product => {
    cart.total += product.total;
  });
  cart.length = cart.cartItems.length;
  return cart;
};

module.exports = getCartInfo;
