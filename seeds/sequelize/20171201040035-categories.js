'use strict';
const faker = require("faker");

module.exports = {
  up: (queryInterface, Sequelize) => {
    let categories = []
    for (let i = 1; i <= 8; i++) {
        categories.push({
            name: faker.commerce.department(),
        });
    }

    return queryInterface.bulkInsert('Categories', categories);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Categories", null, {}, models.Category);
  }
};
