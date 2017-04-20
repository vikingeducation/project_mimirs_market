var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var OrderSchema = new Schema(
  {
    charge: Schema.Types.Mixed,
    firstName: String,
    lastName: String,
    email: String,
    street: String,
    city: String,
    state: String,
    shoppingCart: Array
  },
  {
    timestamps: true
  }
);

var Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
