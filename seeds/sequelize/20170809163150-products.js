"use strict";
const model = require("../../models/sequelize");
const cp = require("child_process");
const fs = require("fs");
let faker = require("Faker");

//setup for getting needed file paths
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: "/Users/ericglover/Desktop/Programming/db/project_mimirs_market/.env"
  });
}
var { PRODUCT_BASENAME } = process.env;
const productPath = __dirname + "/../../" + PRODUCT_BASENAME;

//get categories
let getCategories = async function() {
  let dirs;
  try {
    dirs = await new Promise((resolve, reject) => {
      cp.exec(`ls ${productPath}`, (err, out, stdErr) => {
        //ignore all the .txt files
        //reject if empty or includes '.'
        const c = out.split("\n").filter(item => {
          return !(item.includes(".") || !item);
        });
        console.log(`c = `, c);
        resolve(c);
      });
    });
  } catch (e) {
    throw e;
  }
  // console.log(`dirs = ${dirs}`);
  return await dirs;
  // return dirs;
};

module.exports = {
  up: async function(queryInterface, Sequelize) {
    //make a hash of category names and product url arrays
    let productHash = {};
    await getCategories().then(cats => {
      let promises = cats.map(folder => {
        productHash[folder] = [];
        return new Promise((resolve, reject) => {
          fs.readdir(`${productPath}/${folder}`, (err, files) => {
            if (err) reject(err);
            productHash[folder] = files;
            return resolve(files);
          });
        });
      });
      Promise.all(promises)
        .then(urls => {
          console.log("productHash = ", productHash);
          //make some products
          let seeds = [];
          Object.keys(productHash).forEach((key, index) => {
            for (let i = 0; i < productHash[key].length; i++) {
              let name = "bob";
              let p = {
                name: name.trim(),
                description: "Awesome Things", //faker.lorem.sentence().trim(),
                price: faker.random.number(500),
                sku: Math.random() * 122221,
                img: `images/products/${key}/${productHash[key][i]}`,
                categoryId: index + 1
              };
              console.log("p =", p);
              seeds.push(p);
            }
          });
          console.log("seeds =", seeds);
          return queryInterface.bulkInsert("Products", seeds, {});
        })
        .catch(e => {
          throw e;
        });
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Products", null, {}, model.Products);
  }
};
