"use strict";
const model = require("../../models/sequelize");
let faker = require("Faker");

let categoriesName = [
  "Weapons",
  "Armor",
  "Thatch-Roof-Cottages",
  "Pelts",
  "Shoes",
  "Shields",
  "Grog",
  "Torches",
  "Ships",
  "Horses"
];

module.exports = {
  up: function(queryInterface, Sequelize) {
    let seeds = [];
    for (var i = 0; i < 10; i++) {
      let c = {
        name: categoriesName[i]
      };
      seeds.push(c);
    }
    return queryInterface.bulkInsert("Categories", seeds, {});
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Categories", null, {}, model.Categories);
  }
};
