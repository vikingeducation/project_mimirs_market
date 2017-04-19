"use strict";
const models = require("../../models/sequelize");
const faker = require("faker");

module.exports = {
  up: function(queryInterface, Sequelize) {
    let products = [];
    for (let i = 1; i <= 100; i++) {
      products.push({
        name: faker.commerce.productName(),
        sku: faker.random.alphaNumeric(),
        description: faker.lorem.sentence(),
        price: faker.commerce.price(),
        categoryId: Math.floor(Math.random() * 10 + 1)
      });
    }
    return queryInterface.bulkInsert("Products", products);
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Products", null, {}, models.Product);
  }
};
