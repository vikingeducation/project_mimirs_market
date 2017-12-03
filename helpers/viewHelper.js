const ViewHelper = {
  displayPrice: price => {
    return parseFloat(price).toFixed(2);
  },

  displayQuantity: (product, cart) => {
    return cart[product.id].quantity;
  },

  productSubTotal: (product, cart) => {
    let quantity = cart[product.id].quantity;
    let price = product.price;

    return '$' + ViewHelper.displayPrice(price * quantity);
  },

  cartItemsCount: cart => {
    const count = Object.keys(cart).length;

    if (count) return `(${ count })`;
  }
};

module.exports = ViewHelper;
