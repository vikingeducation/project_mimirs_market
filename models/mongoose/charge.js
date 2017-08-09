var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ChargeSchema = new Schema({
  name: String
});

var Charge = mongoose.model("Charge", ChargeSchema);

module.exports = Charge;
