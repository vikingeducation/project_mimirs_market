const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const OrderSchema = new Schema({
  orderDescription: String,
  revenue: Number,
  stripeToken: String,
  stripeId: String,
  cardType: String,
  customer: {
    fname: String,
    lname: String,
    email: String
  },
  address: {
    street: String,
    city: String,
    state: String
  },
  orderLine: [{
    product: {
      name: String,
      price: Number,
      quantity: Number,
      sku: String,
      description: String,
      category: String
    }
  }]
}, {
  timestamps: true
});

const Order = mongoose.model('Order', OrderSchema);


module.exports = Order;