let ProductHelper = {};

ProductHelper.productsPath = () => "/products/";
ProductHelper.productPath = id => `/products/${id}`;
ProductHelper.addProductPath = id => `/products/${id}`;
// ProductHelper.editProductPath = (id) => `/products/${ id }/edit`;
// ProductHelper.destroyProductPath = (id) => `/products/${ id }/?_method=delete`;

module.exports = ProductHelper;
