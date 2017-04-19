'use strict';
module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    sku: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT,
    categoryId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Product;
};