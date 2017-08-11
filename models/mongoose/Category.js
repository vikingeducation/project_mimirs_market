const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: String,
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }]
  },
  {
    timestamps: true
  }
);

let Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
