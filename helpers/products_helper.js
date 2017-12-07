const ProductsHelper = {};
const faker = require('faker');

ProductsHelper.productPath = id => `/products/${id}`;
ProductsHelper.productImagePath = product => faker.random.image();

module.exports = ProductsHelper;
