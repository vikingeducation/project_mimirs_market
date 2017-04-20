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
      let color = faker.commerce.color();
      color = color[0].toUpperCase() + color.substring(1);
      let name = color + ' ' + faker.commerce.product();
      let sku = faker.finance.account();

      let adjective = faker.commerce.productAdjective();
      adjective = adjective[0].toUpperCase() + adjective.substring(1);

      let material = faker.commerce.productMaterial();
      material = material[0].toLowerCase() + material.substring(1);

      let description = adjective + ' ' + material + ' ' + name;
      let price = faker.commerce.price();
      let photo = photos[Math.floor(Math.random() * 6) + 0];
      let categoryId = Math.floor(Math.random() * 20) + 1;

      let unitsSold = 0;

      products.push({
        name,
        sku,
        description,
        price,
        photo,
        categoryId,
        unitsSold
      });
    }
    return queryInterface.bulkInsert('Products', products);
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Products', null, {}, models.Product);
  }
};
