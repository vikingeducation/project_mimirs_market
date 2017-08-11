const faker = require("faker");
const mongoose = require("mongoose");
const models = require("../../models/mongoose");
const env = process.env.NODE_ENV || "development";
const config = require("../../config/mongo")[env];
const mongooseeder = require("mongooseeder");

const { Order, OrderItem } = models;

//seeds
const seeds = () => {
  let orderItems = [];
  for (i = 0; i < 1000; i++) {
    let orderItem = new OrderItem({
      name: `Item-${i}`,
      price: 10,
      sku: 123098,
      description: "a cool thing",
      category: "Viking stuff",
      quantity: 2
    });
    orderItems.push(orderItem);
  }

  let orders = [];
  for (i = 0; i < 100; i++) {
    let order = new Order({
      firstName: `Viking${i}`,
      lastName: "The Great",
      description: "Viking gear for to pillage.",
      total: 200,
      email: "viking@viking.com",
      address: "123 Pillagers Ln",
      city: "Stockholm",
      state: "VK",
      checkoutDate: "Fri Sep 16 2011 19:05:17 GMT+0900 (JST)",
      StripeToken: "tokie-toke",
      cardType: "VikingCard",
      items: [
        orderItems[i],
        orderItems[i + 100],
        orderItems[i + 200],
        orderItems[i + 300],
        orderItems[i + 400],
        orderItems[i + 500],
        orderItems[i + 600],
        orderItems[i + 700],
        orderItems[i + 800],
        orderItems[i + 900]
      ]
    });
    orders.push(order);
  }

  var promises = [];
  [orderItems, orders].forEach(collection => {
    collection.forEach(model => {
      promises.push(model.save());
    });
  });

  return Promise.all(promises);
};

const mongodbUrl =
  process.env.NODE_ENV === "production"
    ? process.env[config.use_env_variable]
    : `mongodb://${config.host}/${config.database}`;

mongooseeder.seed({
  mongodbUrl: mongodbUrl,
  seeds: seeds,
  clean: true,
  models: models,
  mongoose: mongoose
});
