"use strict";
const model = require("../../models/sequelize");
let faker = require("Faker");

//TODO: GRAB IMAGES AND SEED THEM
//get root path
// fs
//   .readdirSync(__dirname)
//   .filter(function(file) {
//     console.log(file)
//     return (
//       // file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
//     );
//   })
//   .forEach(function(file) {
//     var model = sequelize["import"](path.join(__dirname, file));
//     db[model.name] = model;
//   });

module.exports = {
  up: function(queryInterface, Sequelize) {
    //read dir
    //populate
    let seeds = [];
    for (var i = 0; i < 50; i++) {
      let name = `${faker.random.catch_phrase_descriptor()} ${faker.random.catch_phrase_descriptor()} ${faker.random.bs_noun()}`;
      let p = {
        name: name,
        description: faker.Lorem.sentence(),
        price: faker.random.number(5000),
        sku: Math.random() * 122221,
        img: "images/weapons/war_axe.jpg",
        categoryId: i % 10 + 1
      };
      seeds.push(p);
    }
    return queryInterface.bulkInsert("Products", seeds, {});
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Products", null, {}, model.Products);
  }
};
