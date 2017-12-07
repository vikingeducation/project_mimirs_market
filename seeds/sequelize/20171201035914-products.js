'use strict';
const faker = require("faker");

module.exports = {
  up: (queryInterface, Sequelize) => {
    let products = []
      for (let i = 1; i <= 100; i++) {
        products.push({
          name: faker.commerce.productName(),
          sku: faker.random.uuid(),
          description: faker.lorem.sentence(),
          price: faker.commerce.price(),
          categoryId: Math.floor((Math.random() * 8) + 1)
        });
      }

      return queryInterface.bulkInsert('Products', products);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Products", null, {}, models.Product);
  }
};
