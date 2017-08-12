var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ChargeSchema = new Schema({
  chargeId: String,
  amount: Number,
  description: String,
  currency: String
});

var Charge = mongoose.model("Charge", ChargeSchema);

module.exports = Charge;
