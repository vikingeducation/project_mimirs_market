"use strict";

const faker = require("faker");
const voca = require("voca");

module.exports = {
  up: function(queryInterface, Sequelize) {
    let products = [];
    for (let i = 1; i < 1001; i++) {
      products.push({
        name: voca.titleCase(faker.commerce.productName()),
        sku: faker.random.uuid(),
        price: +faker.commerce.price(1, 500),
        CategoryId: i % 20 + 1,
        description: faker.lorem.lines(6)
      });
    }
    return queryInterface.bulkInsert("Products", products);
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(
      "Products",
      null,
      {},
      Sequelize.models.Product
    );
  }
};
