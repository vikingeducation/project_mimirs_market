const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      fname: String,
      lname: String,
      email: String,
      street: String,
      city: String,
      state: String,
      zip: Number
    },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
    date: Date,
    total: Number
  },
  {
    timestamps: true
  }
);

OrderSchema.virtual("prettyTotal").get(function() {
  return this.total.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
});

OrderSchema.virtual("prettyDate").get(function() {
  return this.date.toLocaleDateString();
});

let Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
