"use strict";

const faker = require("faker");
const voca = require("voca");

module.exports = {
  up: function(queryInterface, Sequelize) {
    let products = [];
    for (let i = 1; i < 101; i++) {
      products.push({
        name: voca.titleCase(faker.commerce.productName()),
        sku: faker.random.uuid(),
        price: +faker.commerce.price(1, 100),
        CategoryId: i % 10 + 1
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
