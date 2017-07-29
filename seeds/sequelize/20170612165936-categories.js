'use strict';
const faker = require('faker');
const models = require('../../models/sequelize');
const config = require('./seeding-config');
const MIN_SEEDS = config.MIN_SEEDS;
const MIN_CATEGORIES = config.MIN_CATEGORIES;

module.exports = {
  up: function (queryInterface, Sequelize) {

    // Uses JS sets to collect unique department names
    let categoryNames = new Set();

    while (categoryNames.size < MIN_CATEGORIES) {
      categoryNames.add(faker.commerce.department());
    }

    categoryNames = Array.from(categoryNames);

    let categories = [];
    for (let i = 0; i < MIN_CATEGORIES; i++) {
      categories.push({
        name: categoryNames[i]
      });
    }
    return queryInterface.bulkInsert('Categories', categories);
  },

  down: function (queryInterface, Sequelize) {

    return queryInterface.bulkDelete('Categories', null, {}, models.Category);
  }
};
