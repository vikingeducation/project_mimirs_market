const ViewHelper = {
  displayPrice: price => {
    price = parseFloat(price);
    return price.toLocaleString(undefined, { minimumFractionDigits: 2 });
  },

  convertToCents: price => {
    return price * 100;
  },

  convertToDollars: price => {
    return price / 100;
  },

  displayQuantity: (product, cart) => {
    return cart[product.id].quantity;
  },

  productSubTotal: (product, cart) => {
    let quantity = cart[product.id].quantity;
    let price = product.price;

    return '$' + ViewHelper.displayPrice(price * quantity);
  },

  productSubTotalToCents: (product, cart) => {
    let quantity = cart[product.id].quantity;
    let price = product.price;

    return ViewHelper.convertToCents(price * quantity);
  },

  cartItemsCount: cart => {
    const count = Object.keys(cart).length;

    if (count) return `(${ count })`;
  },

  displayQuantity: (productId, cart) => {
    return cart[productId].quantity;
  },

  displayDate: unixTimestamp => {
    let date = new Date(unixTimestamp * 1000)
    return `${ date.getMonth() + 1 }/${ date.getDate() }/${ date.getFullYear() }`
  },

  toString: item => {
    return item.toString();
  },

  length: item => {
    return item.length;
  }
};

module.exports = ViewHelper;
