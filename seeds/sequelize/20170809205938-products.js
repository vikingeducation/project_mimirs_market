"use strict";
const faker = require("faker");
const { generate } = require("random-image-url");


module.exports = {
  up: function(queryInterface, Sequelize) {
    let products = [];

    for (let i = 0; i < 30; i++) {
      products.push({
        name: faker.fake(`{{commerce.productName}}`),
        sku: faker.fake(`{{finance.bitcoinAddress}}`),
        description: faker.fake(`{{lorem.paragraph}}`),
        price: Math.floor((Math.random() * 100)) + 1,
        CategoryId: Math.floor((Math.random() * 7)) + 1,
        imageUrl: generate()
      });
    }
    return queryInterface.bulkInsert("Products", products);
  },

  down: function(queryInterface, Sequelize) {}
};
