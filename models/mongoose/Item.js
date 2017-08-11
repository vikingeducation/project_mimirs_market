const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    name: String,
    id: Number,
    price: Number,
    sku: String,
    description: String,
    quantity: Number
  },
  {
    timestamps: true
  }
);

ItemSchema.virtual("prettyPrice").get(function() {
  return this.price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
});

let Item = mongoose.model("Item", ItemSchema);
module.exports = Item;
