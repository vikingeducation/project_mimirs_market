"use strict";
const model = require("../../models/sequelize");
let faker = require("Faker");

//file path to products
// const productBasename = require(__dirname + "/../../.env")["productPath"];
// const productPath = __dirname + "/../../" + productBasename;

// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }
// var { PRODUCT_BASENAME } = process.env;
// const productPath = __dirname + "/../../" + PRODUCT_BASENAME;

//TODO: GRAB IMAGES AND SEED THEM
//seeds the products
////////store them all in a hash
////////return the hash for seeding
// let getUrls = function() {
//   let productHash = {};
//   let pCat = new Promise((resolve, reject) => {
//     cp.exec(`ls -R ${productPath}`, (err, out, stdErr) => {
//       //grab all the categories
//       // console.log(`out = ${process.argv[1] + "/public/images"}`);
//       console.log(`out = ${out}`);
//
//
//       let strArr = out.split("\n");
//       const c = strArr.filter(item => {
//         return !(item.includes(".") || !item);
//       });
//       return resolve(c);
//
//
//     });
//   }).then(categories => {
//     //for each category get the product img urls
//     categories.forEach()
//   });
//
//   return productHash;
// };

module.exports = {
  up: function(queryInterface, Sequelize) {
    let seeds = [];
    // let urls = getUrls();
    for (var i = 0; i < 50; i++) {
      let name = `${faker.hacker.adjective()} ${faker.hacker.noun()}`;
      let p = {
        name: name.trim(),
        description: faker.lorem.sentence().trim(),
        price: faker.random.number(500),
        sku: Math.random() * 122221,
        img: "images/products/weapons/war_axe.jpg",
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
