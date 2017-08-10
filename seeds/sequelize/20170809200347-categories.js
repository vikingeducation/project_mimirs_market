"use strict";
const model = require("../../models/sequelize");
let faker = require("Faker");

//TODO: make this automagically populate categories from
//public/images/x where x becomes a category
let categoriesName = [
  "Weapons",
  "Armor",
  "Heads",
  "Pelts",
  "Parisols",
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
