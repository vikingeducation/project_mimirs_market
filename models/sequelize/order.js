"use strict";
module.exports = (sequelize, DataTypes) => {
  var Order = sequelize.define("Order", {
    userId: DataTypes.STRING,
    orderId: DataTypes.NUMBER
  });

  Order.associate = function(models) {
    Order.belongsTo(models.User, {
      foreignKey: "userId"
    });
  };

  return Order;
};
