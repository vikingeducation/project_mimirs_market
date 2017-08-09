'use strict';

let products = [];

module.exports = {
  up: function(queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    for (let i = 0; i < 4; i++) {
      products.push({name: `product${i}`,
        sku: `sku${i}`,
        description: "General description",
        price: 85,
        categoryId: i
      })
    }
    return queryInterface.bulkInsert("Products", products)
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
