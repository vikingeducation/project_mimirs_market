'use strict';
const models = require('../../models/sequelize');
const faker = require('faker');

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
    let categoryNames = new Set();
    while (categoryNames.size < 10) {
      categoryNames.add(faker.commerce.department());
    }
    categoryNames = [...categoryNames];

    const categories = [];
    for (let i = 0; i < 10; i++) {
      categories.push({
        name: categoryNames[i]
      });
    }

    return queryInterface.bulkInsert('Categories', categories);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Categories', null, {}, models.Category);
  }
};
