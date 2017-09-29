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
    let products = [];
    for (let i = 0; i < 40; i++) {
      products.push({
        name: faker.commerce.productName(),
        sku: Number(faker.random.number()),
        description: faker.lorem.paragraph(),
        price: Number(faker.commerce.price()),
        image: "assets/images/vikingShip.png",
        categoryId: i % 8 + 1
      });
    }
    return queryInterface.bulkInsert("Products", products);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete("Products", null, {}, models.Products);
  }
};
