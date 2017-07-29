const CartHelper = {};

CartHelper.cartShowPath = () => '/cart';
CartHelper.cartPath = (id) => `/cart/${ id }`;
CartHelper.cartQuantity = (id, cart) => {
  return cart[id];
};

CartHelper.cartHasProduct = (id, cart) => {
  return cart.hasOwnProperty(id);
};

module.exports = CartHelper;