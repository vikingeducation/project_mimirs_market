const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    category: String,
    name: String,
    id: Number,
    price: Number,
    sku: String,
    description: String,
    count: Number
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
