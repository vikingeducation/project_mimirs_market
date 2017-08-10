module.exports = {
  productsPath: () => "/products/",
  productPath: id => `/products/${id}`,
  addProductPath: id => `/products/${id}/add`
};

// ProductHelper.editProductPath = (id) => `/products/${ id }/edit`;
// ProductHelper.destroyProductPath = (id) => `/products/${ id }/?_method=delete`;
