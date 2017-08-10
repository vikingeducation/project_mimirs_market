"use strict";
const faker = require("faker");

module.exports = {
  up: function(queryInterface, Sequelize) {
    let categories = [];
    for(let i = 0; i < 10; i++) {
      categories.push({
        name: faker.fake(`{{commerce.department}}`)
      });
    }

    return queryInterface.bulkInsert("Categories", categories);
  },

  down: function(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
