"use strict";
const models = require("../../models/sequelize");
const faker = require("faker");
const request = require("sync-request");
const jsonsafeparse = require("json-safe-parse");
const shortid = require('shortid');


module.exports = {
  up: function(queryInterface, Sequelize) {
    let products = [];
    let imageWords = [];
    let images = [];
    for (let i = 1; i <= 100; i++) {
      let fakeName = faker.commerce.productName();
      let nameArr = fakeName.split(" ");
      console.log(nameArr[2]);
      let pic;
      if (!imageWords.includes(nameArr[2])) {
        let re = request(
          "GET",
          `https://pixabay.com/api/?key=5151824-2eedc1f8048f7fc6db3d00e57&q=${nameArr[2]}`
        );
        let obj = jsonsafeparse(re.body.toString("utf-8") || "{}");
        imageWords.push(nameArr[2]);
        images.push(obj.hits);
        let index = Math.floor(Math.random() * obj.hits.length);
        pic = obj.hits[index].webformatURL;
      } else {
        let index = imageWords.indexOf(nameArr[2]);
        let random = Math.floor(Math.random() * images[index].length);
        pic = images[index][random].webformatURL;
      }

      products.push({
        name: fakeName,
        sku: shortid.generate(),
        description: faker.lorem.sentence(),
        price: Math.floor(Math.random() * 10000) / 100.0,
        categoryId: Math.floor(Math.random() * 10 + 1),
        img: pic
      });
    }
    return queryInterface.bulkInsert("Products", products);
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Products", null, {}, models.Product);
  }
};
