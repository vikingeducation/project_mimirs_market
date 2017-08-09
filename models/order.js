'use strict';
const models = require("./../models");
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
  Order.associate = function(models) {
    Order.hasOne(models.Users);
    Order.belongsToMany(
      models.Products,
      { through: 'ProductsCategory'}
    )
  }
  });
  return Order;
};
