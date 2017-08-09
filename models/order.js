'use strict';
module.exports = function(sequelize, DataTypes) {
  var Order = sequelize.define('Order', {
    shippedStatus: DataTypes.BOOLEAN,
    shipState: DataTypes.INTEGER,
    shipCountry: DataTypes.STRING,
    shipCity: DataTypes.STRING,
    price: DataTypes.FLOAT,
    date: DataTypes.DATE,
    userId: DataTypes.INTEGER
  }
  });
  return Order;
};
