const CheckoutHelper = {};

CheckoutHelper.checkoutPath = () => `/checkout`;

CheckoutHelper.checkoutProductTotal = (id, cart, price) => {
  return cart[id] * price;
};

module.exports = CheckoutHelper;