'use strict';
var faker = require('faker');

module.exports = {
  up: function(queryInterface, Sequelize) {
    var products = [];
    var photos = [
      'viking_guy.jpg',
      'viking_girl.jpg',
      'business.jpeg',
      'cat.jpeg',
      'food.jpeg',
      'nature.jpeg',
      'transport.jpeg'
    ];

    for (let i = 1; i < 100; i++) {
      let name = faker.commerce.color() + ' ' + faker.commerce.product();
      let sku = faker.finance.account();
      let description = faker.commerce.productAdjective() +
        ' ' +
        faker.commerce.productMaterial() +
        ' ' +
        name;
      let price = faker.commerce.price();
      let photo = photos[Math.floor(Math.random() * 6) + 0];
      let categoryId = Math.floor(Math.random() * 20) + 1;

      products.push({
        name,
        sku,
        description,
        price,
        photo,
        categoryId
      });
    }
    return queryInterface.bulkInsert('Products', products);
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Products', null, {}, models.Product);
  }
};
