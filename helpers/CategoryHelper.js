let CategoryHelper = {};

CategoryHelper.categoriesPath = () => "/categories/";
CategoryHelper.categoryPath = id => `/categories/${id}`;
// CategoryHelper.addProductPath = () => "/products/add";
// CategoryHelper.editProductPath = (id) => `/products/${ id }/edit`;
// CategoryHelper.destroyProductPath = (id) => `/products/${ id }/?_method=delete`;

module.exports = CategoryHelper;
