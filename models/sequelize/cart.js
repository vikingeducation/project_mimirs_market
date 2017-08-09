"use strict";
module.exports = function(sequelize, DataTypes) {
  var Cart = sequelize.define("Cart", {
    ProductId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  });

  Cart.associate = function(models) {
    Cart.belongsTo(models.User);
    Cart.belongsTo(models.Product);
  }

  return Cart;
};
