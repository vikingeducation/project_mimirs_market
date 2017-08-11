const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var OrderSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    description: String,
    total: Number,
    email: String,
    streetAddress: String,
    city: String,
    state: String,
    checkoutDate: Schema.Types.Date,
    StripeToke: String,
    cardType: String,
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItem"
      }
    ]
  },
  {
    timestamps: true
  }
);

var Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
