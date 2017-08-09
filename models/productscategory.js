'use strict';
module.exports = function(sequelize, DataTypes) {
  var ProductsCategory = sequelize.define('ProductsCategory', {
    productId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ProductsCategory;
};