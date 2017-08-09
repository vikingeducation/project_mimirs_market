'use strict';

const faker = require('faker')
const voca = require('voca')

module.exports = {
  up: function (queryInterface, Sequelize) {
  
  let categories = [];
  for (let i = 0; i < 10; i++) {
    categories.push({
      name: voca.titleCase(faker.commerce.productAdjective(1))
      });
    }
    return queryInterface.bulkInsert('Categories', categories);  
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete(
      "Categories",
      null,
      {},
      Sequelize.models.Category
    );
  }
};
