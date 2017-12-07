"use strict";
var faker = require("faker");

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    var products = [];
    for (let i = 0; i < 10; i++) {
      products.push({
        name: faker.commerce.productName(),
        sku: faker.random.number(),
        description: faker.lorem.sentence(),
        price: faker.random.number(),
        categoryId: i + 1
      });
    }
    return queryInterface.bulkInsert("Products", products);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
