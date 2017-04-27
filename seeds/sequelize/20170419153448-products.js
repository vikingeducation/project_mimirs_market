"use strict";
const models = require("../../models/sequelize");
const faker = require("faker");
const request = require("sync-request");
const jsonsafeparse = require("json-safe-parse");
const shortid = require('shortid');


module.exports = {
  up: function(queryInterface, Sequelize) {
    let products = [];
    for (let i = 1; i <= 100; i++) {
      const fakeName = faker.commerce.productName();

      products.push({
        name: fakeName,
        sku: shortid.generate(),
        description: faker.lorem.sentence(),
        price: Math.floor(Math.random() * 10000) / 100.0,
        categoryId: Math.floor(Math.random() * 10 + 1),
        img: `/images/products/${Math.floor(Math.random() * 10 + 1)}.jpg`
      });
    }
    return queryInterface.bulkInsert("Products", products);
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Products", null, {}, models.Product);
  }
};
