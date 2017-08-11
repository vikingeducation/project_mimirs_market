module.exports = {
  cartPath: () => "/cart/",
  newCartPath: id => `/cart/${id}`,
  editCartPath: id => `/cart/${id}?_method=put`,
  destroyCartPath: id => `/cart/${id}?_method=delete`,
  destroyCartsPath: () => "/cart?_method=delete",
  checkoutPath: () => "/cart/checkout"
};
