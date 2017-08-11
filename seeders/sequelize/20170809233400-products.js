"use strict";
var models = require("C:\\Users\\High Definition\\Desktop\\mMarket\\assignment_okodin\\models");
module.exports = {
  up: function(queryInterface, Sequelize) {
    let products = [];

    for (let i = 0; i < 4; i++) {
      products.push({
        name: `product${i}`,
        sku: "http://i.imgur.com/8cNnaaw.jpg",
        description: "General description",
        price: 85,
        CategoryId: i + 1
      });
    }
    return queryInterface.bulkInsert("Products", products);
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Products", null, {}, models.Product);
  }
};
