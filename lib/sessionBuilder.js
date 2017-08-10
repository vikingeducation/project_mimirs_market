const sessionBuilder = cart => {
  let products = [];
  Object.keys(cart).forEach(productId => {
    let productTotal = cart[productId].quantity * cart[productId].price;
    cart[productId].total = productTotal;
    products.push(cart[productId]);
  });
  return products;
};

module.exports = sessionBuilder;
