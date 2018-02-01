const models = require('../../models/sequelize');
const { Category } = models;
const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    var categories = [];

    for (let i = 0; i < 5; i++) {
      categories.push({ name: faker.commerce.department() });
    }

    return queryInterface.bulkInsert('Categories', categories);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {}, Category);
  }
};

