const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    fname: String,
    lname: String,
    email: String,
    street: String,
    city: String,
    state: String,
    revenue: Number,
    quantity: Number,
    stripe: {},
    stripeToken: String,
    products: {}
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
