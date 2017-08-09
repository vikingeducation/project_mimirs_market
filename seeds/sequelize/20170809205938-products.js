"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    let products = [];

    for (let i = 0; i < 4; i++) {
      products.push({
        name: `product${i}`,
        sku: `sku${i}`,
        description: "General description",
        price: 85,
        categoryId: i + 1
      });
    }
    return queryInterface.bulkInsert("Products", products);
  },

  down: function(queryInterface, Sequelize) {}
};
