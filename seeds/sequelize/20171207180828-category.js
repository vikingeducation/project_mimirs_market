"use strict";
const faker = require("faker");

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    var categories = [];
    for (let i = 0; i < 10; i++) {
      categories.push({
        name: faker.commerce.department(),
        categoryId: i
      });
    }
    return queryInterface.bulkInsert("Categories", categories);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
