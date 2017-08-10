"use strict";
const faker = require("faker");

module.exports = {
  up: function(queryInterface, Sequelize) {
    let categories = [];
    let categoryNames = [];
    let category = faker.fake(`{{commerce.department}}`);
    for(let i = 0; i < 7; i++) {
      while(categoryNames.includes(category)) {
        category = faker.fake(`{{commerce.department}}`);
      }
      categories.push({
        name: category
      });
      categoryNames.push(category);
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
