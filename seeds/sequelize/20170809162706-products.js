const models = require("./../../models/sequelize");
const faker = require("faker");

("use strict");

module.exports = {
  up: function(queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    let products = [];
    for (let i = 0; i < 100; i++) {
      products.push({
        sku: `FKP12345N${i}`,
        name: faker.commerce.productName(),
        description: faker.lorem.sentences(),
        price: faker.commerce.price(),
        categoryId: Math.floor(Math.random() * 10 + 1),
        inStock: Math.floor(Math.random() * 50 + 1)
      });
    }
    return queryInterface.bulkInsert("Products", products);
  },

  down: function(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete("Products", null, {}, models.Products);
  }
};
