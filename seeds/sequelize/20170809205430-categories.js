"use strict";

let cats = ["weapons", "balloons", "chairs", "onions"];

module.exports = {
  up: function(queryInterface, Sequelize) {
    let categories = [];
    cats.forEach(ele => {
      categories.push({
        name: ele
      });
    });
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
