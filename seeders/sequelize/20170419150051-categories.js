"use strict";
var faker = require("faker");

module.exports = {
  up: function(queryInterface, Sequelize) {
    var categories = [];
    for (let i = 1; i < 21; i++) {
      let name = faker.hacker.adjective() + " " + faker.commerce.department();

      categories.push({
        name
      });
    }
    return queryInterface.bulkInsert("Categories", categories);
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Categories", null, {}, models.Category);
  }
};
