'use strict';
var faker = require('faker');
var models = require('./../../models/sequelize');

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
    var products = [];
    for (let i = 0; i < 1000; i++) {
      products.push({
        name: faker.commerce.productName(),
        SKU: faker.random.number(),
        description: faker.lorem.paragraph(),
        price: faker.commerce.price(),
        categoryID: Math.floor(Math.random() * 10 + 31),
        image: faker.image.image(),
        quantity: Math.floor(Math.random() * 100)
      });
    }
    return queryInterface.bulkInsert('Product', products);

  },

  down: function(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Product', null, {}, models.Product);
  }
};
