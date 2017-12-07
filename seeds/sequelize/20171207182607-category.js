'use strict';

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
    let foods = {
      1: 'Italian',
      2: 'German',
      3: 'Chinese',
      4: 'Dominican',
      5: 'Mexican',
      6: 'Japanese',
      7: 'Brazilian',
      8: 'Hawaiian',
      9: 'French',
      10: 'Indian'
    };
    let categories = [];
    for (var i = 0, len = foods.length; i < len; i++) {
      categories.push({name: foods[i]});
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
  },
};
