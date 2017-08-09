'use strict';
module.exports = function(sequelize, DataTypes) {
  var ProductCategory = sequelize.define('ProductCategory', {
    CategoryId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ProductCategory;
};