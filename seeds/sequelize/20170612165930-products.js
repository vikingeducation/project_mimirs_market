'use strict';
const models = require('../../models/sequelize');
const faker = require('faker');
const config = require('./seeding-config');
const MIN_SEEDS = config.MIN_SEEDS;
const MIN_CATEGORIES = config.MIN_CATEGORIES;

module.exports = {
  up: function (queryInterface, Sequelize) {

    let products = [];
    for (let i = 0; i < MIN_SEEDS; i++) {
      products.push({
        name: faker.commerce.productName(),
        sku: faker.random.uuid(),
        description: faker.lorem.paragraphs(),
        price: faker.commerce.price(),
        categoryId: (i % MIN_CATEGORIES) + 1,
      });
    }
    return queryInterface.bulkInsert('Products', products);
  },

  down: function (queryInterface, Sequelize) {

    return queryInterface.bulkDelete('Products', null, {}, models.Product);
  }
};
