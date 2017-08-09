var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var OrderSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    street: String,
    city: String,
    state: String,
    country: String,
    items: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
    charge: { type: Schema.Types.ObjectId, ref: "Charge" }
  },
  { timeStamps: true }
);

var Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
