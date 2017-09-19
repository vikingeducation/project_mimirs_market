module.exports = function checkIfInCart(req, res, products) {
  let cart = req.session.cart.map(i => i.id);
  products.forEach((p, i) => {
    if (cart.includes(p.id.toString())) {
      products[i].inCart = true;
    }
  });
  return products;
};
