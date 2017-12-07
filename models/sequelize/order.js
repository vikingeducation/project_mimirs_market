'use strict';
module.exports = (sequelize, DataTypes) => {
  var Order = sequelize.define('Order', {
    userId: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER,
  });

  Order.associate = function(models) {
    Order.belongsTo(models.User, {
      foreignKey: 'userId',
    });
  };

  return Order;
};
