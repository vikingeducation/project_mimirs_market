"use strict";

const model = require("../../models");

module.exports = {
  up: function(queryInterface, Sequelize) {
    //stuff
    return queryInterface.bulkInsert("Product", [], {});
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Person", null, {}, model.Products);
  }
};
