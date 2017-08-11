var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var OrderSchema = {
  firstname: String,
  lastname: String,
  email: String,
  streetaddress: String,
  state: String,
  products: Schema.Types.Mixed,
  totalcost: Number,
  date: Date,
  productIdArray: Array,
  productQuantityArray: Array,
  productPriceArray: Array
};

var Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
