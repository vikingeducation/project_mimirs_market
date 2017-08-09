'use strict';
module.exports = function(sequelize, DataTypes) {
  var ProductsOrder = sequelize.define('ProductsOrder', {
    productId: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ProductsOrder;
};