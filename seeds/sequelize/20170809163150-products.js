"use strict";
const model = require("../../models/sequelize");
let faker = require("Faker");

//file path to products
const productBasename = require(__dirname + "/../../.env")["productPath"];
const productPath = __dirname + "/../../" + productBasename;

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
//seeds the categories
let getUrls = async function() {
  let productHash;
  try {
    productHash = await new Promise((resolve, reject) => {
      cp.exec(`ls -R ${productPath}`, (err, out, stdErr) => {
        //grab all the categories

        //store them all in a hash
        //return the hash for seeding
        let strArr = out.split("\n");
        const c = strArr.filter(item => {
          return !(item.includes(".") || !item);
        });
        //then for each category grab it's files

        c.forEach(category => {});
        resolve(c);

        console.log(`out = ${process.argv[1] + "/public/images"}`);
        console.log(`out = ${out}`);
      });
    });
  } catch (e) {
    throw e;
  }
  return await productHash;
};

module.exports = {
  up: function(queryInterface, Sequelize) {
    let seeds = [];
    // let urls = getUrls();
    for (var i = 0; i < 50; i++) {
      let name = `${faker.random.catch_phrase_descriptor()} ${faker.random.catch_phrase_descriptor()} ${faker.random.bs_noun()}`;
      let p = {
        name: name.trim(),
        description: faker.Lorem.sentence().trim(),
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
