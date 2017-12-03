const ViewHelper = {
  displayPrice: price => {
    return parseFloat(price).toFixed(2);
  },

  cartItemsCount: cart => {
    const count = Object.keys(cart).length;

    if (count) return `(${ count })`;
  }
};

module.exports = ViewHelper;
