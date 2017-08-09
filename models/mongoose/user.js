var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create a new schema for
// the user model
var UserSchema = new Schema(
  {
    email: String
  },
  {
    timestamps: true
  }
);

// Create the model with a defined schema
var User = mongoose.model("User", UserSchema);

module.exports = User;
