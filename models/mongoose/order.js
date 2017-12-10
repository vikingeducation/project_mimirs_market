var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema(
  {
    fname: String,
    lname: String,
    street: String,
    city: String,
    stripeToken: String,
    stripeTokenType: String,
    stripeEmail: String,
    total: Number,
    product: String,
  },
  {
    timestamps: true,
  }
);

// Create the model with a defined schema
var Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
