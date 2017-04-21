var moment = require("moment");
var numeral = require("numeral");

var UtilsHelper = {};

UtilsHelper.isInCart = function(productId, shoppingCart) {
  let inCart = false;

  for (let i = 0; i < shoppingCart.length; i++) {
    let product = shoppingCart[i];
    if (productId === product.id) {
      inCart = true;
      break;
    }
  }

  return inCart;
};

UtilsHelper.subtotal = function(product) {
  return product.price * product.quantity;
};
UtilsHelper.formatDate = function(date) {
  return moment(date).format("MMM Do YY");
};
UtilsHelper.formatCurrency = function(number) {
  return numeral(number).format("$0.00");
};
UtilsHelper.parseAmount = function(number) {
  return parseInt(number * 100);
};

module.exports = UtilsHelper;
