let AppHelper = {};

AppHelper.alreadyInCart = (cartIds, productId) => {
  if (cartIds) return cartIds.includes(productId);
};

AppHelper.currency = number => {
  return "$" + number.toFixed(2);
};

module.exports = AppHelper;
