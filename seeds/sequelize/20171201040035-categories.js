'use strict';
const faker = require("faker");

let categoryNames = [
  "Books",
  "Jewelry",
  "Household",
  "Garden",
  "Shoes",
  "Tools",
  "Health",
  "Sports"
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    let categories = []
    for (let i = 0; i < 8; i++) {
        categories.push({
            name: categoryNames[i],
        });
    }

    return queryInterface.bulkInsert('Categories', categories);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Categories", null, {}, models.Category);
  }
};
