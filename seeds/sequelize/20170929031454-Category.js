"use strict";
var faker = require("faker");
var models = require("../../models/sequelize/");

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
    let categorys = [];
    for (let i = 0; i < 40; i++) {
      categorys.push({
        name: faker.commerce.department()
      });
    }
    return queryInterface.bulkInsert("Categorys", categorys);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete("Categorys", null, {}, models.Categorys);
  }
};
