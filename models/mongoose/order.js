const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    description: String,
    revenue: Number,
    stripeToken: String,
    cardType: String,
    stripeId: String,
    user: {
      fname: String,
      lname: String,
      email: String
    },
    address: {
      street: String,
      city: String,
      state: String
    },
    orderItems: [
      {
        product: {
          name: String,
          sku: String,
          description: String,
          price: Number,
          category: String,
          quantity: Number
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
