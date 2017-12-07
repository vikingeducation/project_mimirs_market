"use strict";
module.exports = (sequelize, DataTypes) => {
  var Order = sequelize.define("Order", {
    userId: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER
  });

  return Order;
};
