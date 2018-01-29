'use strict';
var models = require('./../../models/sequelize');

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
    var products = [];
    for (let i = 0; i < 50; i++) {
      products.push({
        name: `Foo${i}`,
        categoryId: Math.floor(i/5) + 1,
        price: i + 1,
        stock: i + 1,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      });
    }
    return queryInterface.bulkInsert('Products', products);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Products', null, {}, models.Product);
  },
};
