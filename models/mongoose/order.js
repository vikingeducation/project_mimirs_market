const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    street: String,
    city: String,
    state: String,
    items: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
    charge: { type: Schema.Types.ObjectId, ref: "Charge" }
  },
  { timeStamps: true }
);


OrderSchema.virtual('updateOrderItem').set(function(orderItem) {
  return this.items.push(orderItem);
})

const Order = mongoose.model("Order", OrderSchema);



module.exports = Order;
