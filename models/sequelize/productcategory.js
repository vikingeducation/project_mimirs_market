"use strict";
module.exports = function(sequelize, DataTypes) {
  var ProductCategory = sequelize.define("ProductCategory", {
    CategoryId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER
  });
  return ProductCategory;
};
