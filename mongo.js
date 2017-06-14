const mongoose = require('mongoose');
const env = process.env.NODE_ENV || 'development';
const config = require('./config/mongo')[env];

module.exports = () => {
  const envUrl = process.env[config.use_env_variable];
  const localUrl = `mongodb://${ config.host }/${ config.database }`;
  const mongoUrl =  envUrl ? envUrl : localUrl;
  return mongoose.connect(mongoUrl);
};

let lole = {
  "checkout": {
    "revenue": "1194",
    "customer": {
      "fname": "Joe",
      "lname": "Blow",
      "email": "joeblow@gmail.com"
    },
    "address": {
      "street": "lol",
      "city": "lol",
      "state": "Connecticut"
    },
    "orderLine": [
      {
        "product": {
          "name": "Awesome",
          "price": "354.00",
          "quantity": "3",
          "sku": "4615f6f3-a259-498d-b06a-8779ce6a4263",
          "description": "Eos"
        }
      },
      {
        "product": {
          "name": "Awesome",
          "price": "132.00",
          "quantity": "1",
          "sku": "b0ba9bdf-bfbd-419f-843c-9fbb0ed23f50",
          "description": "Aut"
        }
      }
    ]
  },
  "stripeToken": "tok_1AUfx4FP01MO8HfkGvQxDDcj",
  "stripeTokenType": "card",
  "stripeEmail": "joeblow@gmial.com"
}