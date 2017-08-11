"use strict";
var models = require("C:\\Users\\High Definition\\Desktop\\mMarket\\assignment_okodin\\models");
var cats = ["weapons", "balloons", "chairs", "onions"];
module.exports = {
  up: function(queryInterface, Sequelize) {
    let categories = [];
    cats.forEach(i => {
      categories.push({
        name: i
      });
    });

    return queryInterface.bulkInsert("Categories", categories);
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Categories", null, {}, models.Category);
  }
};
