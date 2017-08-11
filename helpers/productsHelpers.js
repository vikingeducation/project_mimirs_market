let ProductsHelper = {};

ProductsHelper.productsPath = () => '/products';
ProductsHelper.productPath = (productId, CategoryId) => `/products/${productId}/category/${CategoryId}`;


module.exports = ProductsHelper;
