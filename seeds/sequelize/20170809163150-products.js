"use strict";
const model = require("../../models/sequelize");
let faker = require("Faker");

//

module.exports = {
  up: function(queryInterface, Sequelize) {
    let seeds = [];
    for (var i = 0; i < 50; i++) {
      let name = `${faker.random.catch_phrase_descriptor()} ${faker.random.bs_adjective()} ${faker.random.bs_noun()}`;
      let p = {
        name: name,
        description: faker.Lorem.sentence(),
        price: faker.random.number(5000),
        sku: Math.random() * 122221,
        categoryId: i % 10
      };
      seeds.push(p);
    }
    return queryInterface.bulkInsert("Products", seeds, {});
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Products", null, {}, model.Products);
  }
};
