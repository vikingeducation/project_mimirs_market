"use strict";
const models = require("../models/sequelize");
const faker = require("faker");

module.exports = {
  up: function(queryInterface, Sequelize) {
    let categories = [];
    for (let i = 1; i <= 10; i++) {
      categories.push({
        name: faker.commerce.department()
      });
    }
    return queryInterface.bulkInsert("Categories", categories);
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Categories", null, {}, models.Category);
  }
};
