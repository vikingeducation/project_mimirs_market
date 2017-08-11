"use strict";
const model = require("../../models/sequelize");
let faker = require("Faker");

//

const images = [
  "https://vignette2.wikia.nocookie.net/elderscrolls/images/3/38/NordicBattleaxe.png/revision/latest?cb=20130309120450",
  "http://vignette2.wikia.nocookie.net/elderscrolls/images/8/80/Linwes_armor.png/revision/latest?cb=20121011011901",
  "https://i.pinimg.com/236x/88/fa/91/88fa9159b7ce5c8a25ed17b0e53b57a9--little-cottages-small-cottages.jpg",
  "http://www.glacierwear.com/media/catalog/product/cache/1/small_image/400x/17f82f742ffe127f42dca9de82fb58b1/i/m/image002_43_1.png",
  "https://ak1.ostkcdn.com/images/products/10899739/P17933376.jpg",
  "https://vignette1.wikia.nocookie.net/elderscrolls/images/c/ce/Steel_Shield_SK.png/revision/latest?cb=20121027210457",
  "https://wiki.guildwars.com/images/thumb/d/d9/Bottle_of_Grog.jpg/151px-Bottle_of_Grog.jpg",
  "https://previews.123rf.com/images/olganikitina/olganikitina1207/olganikitina120700030/14464691-sports-competition-torch-with-flame-isolated-Vector-Stock-Vector.jpg",
  "https://s-media-cache-ak0.pinimg.com/originals/bb/9d/43/bb9d43fdec1a73dc3b0fdd56ab4321d8.jpg",
  "http://worldartsme.com/images/cartoon-horse-free-clipart-1.jpg"
];

module.exports = {
  up: function(queryInterface, Sequelize) {
    let seeds = [];
    for (var i = 0; i < 50; i++) {
      let name = `${faker.random.catch_phrase_descriptor()} ${faker.random.catch_phrase_descriptor()} ${faker.random.bs_noun()}`;
      let p = {
        name: name,
        description: faker.Lorem
          .sentence()
          .concat(
            faker.Lorem
              .sentence()
              .concat(faker.Lorem.sentence().concat(faker.Lorem.sentence()))
          ),
        imageUrl: images[i % 10],
        price: faker.random.number(5000),
        sku: Math.random() * 122221,
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
