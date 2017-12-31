const calculateCart = (products, cartItems) => {
  let total = 0;

  for (let id in cartItems) {
    products.forEach(product => {
      if (product.id.toString() === id) {
        total += cartItems[id] * product.price;
      }
    });
  }

  return total;
};

module.exports = { calculateCart };

