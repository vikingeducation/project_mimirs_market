"use strict";
const model = require("../../models/sequelize");
let faker = require("Faker");
const cp = require("child_process");
// const productPath = require("./../../.env")["productPath"];
const productBasename = require(__dirname + "/../../.env")["productPath"];
const productPath = __dirname + "/../../" + productBasename;
console.log(`productPath = ${productPath}`);
//TODO: make this automagically populate categories from
//public/images/x where x becomes a category

//seeds the categories
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
        resolve(c);
      });
    });
  } catch (e) {
    throw e;
  }
  console.log(`dirs = ${dirs}`);
  return await dirs;
  // return dirs;
};

module.exports = {
  up: function(queryInterface, Sequelize) {
    let seeds = [];
    getCategories().then(categoryNames => {
      for (var i = 0; i < categoryNames.length; i++) {
        seeds.push({
          name: categoryNames[i]
        });
      }
      return queryInterface.bulkInsert("Categories", seeds, {});
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Categories", null, {}, model.Categories);
  }
};
