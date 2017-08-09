"use strict";
module.exports = function(sequelize, DataTypes) {
  var Cart = sequelize.define("Cart", {
    ProductId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  });
  return Cart;
};
