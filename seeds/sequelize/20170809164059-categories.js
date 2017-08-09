"use strict";
const models = require("./../../models/sequelize");
const faker = require("faker");

module.exports = {
  up: function(queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    let categories = [];
    for (let i = 0; i < 10; i++) {
      categories.push({
        name: faker.commerce.department()
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
    return queryInterface.bulkDelete("Categories", null, {}, models.Categories);
  }
};
