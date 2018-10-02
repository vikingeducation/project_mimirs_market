const calculateCart = (products, cartItems) => {
  let total = 0;

  for (let id in cartItems) {
    products.forEach(product => {
      if (product.id.toString() === id) {
        product.subtotal = cartItems[id] * product.price;
        total += cartItems[id] * product.price;
      }
    });
  }

  return total;
};

const checkCartContent = (products, cartItems) => {
  for (let id in cartItems) {
    products.forEach(product => {
      if (product.id.toString() === id) {
        product.inCart = true;
        product.quantity = cartItems[id];
      }
    });
  }

  return products;
};

module.exports = { calculateCart, checkCartContent };
