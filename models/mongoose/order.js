const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const {
  isEmail,
  isAlphanumeric,
  isAlpha
} = require('validator');

const OrderSchema = new Schema(
  {
    fname: {
      type: String,
      required: true
    },
    lname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      validate: [ isEmail, 'Invalid email address' ]
    },
    street: {
      type: String,
      required: true,
      validate: [ isAlphanumeric, 'Invalid street address' ]
    },
    city: {
      type: String,
      required: true,
      validate: [ isAlpha, 'Invalid city name' ]
    },
    state: {
      type: String,
      required: true,
      validate: [ isAlpha, 'Invalid state name' ]
    },
    revenue: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    stripe: {},
    stripeToken: {
      type: String,
      required: true
    },
    products: {}
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
