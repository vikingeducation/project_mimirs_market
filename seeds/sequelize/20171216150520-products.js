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
    const products = [];
    for (let i = 0; i < 100; i++) {
      products.push({
        name: faker.commerce.productName(),
        sku: faker.random.uuid(),
        description: faker.lorem.paragraph(),
        price: faker.commerce.price(),
        categoryId: Math.floor(Math.random() * 10) + 1
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
  }
};
