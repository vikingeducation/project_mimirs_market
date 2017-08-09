"use strict";
module.exports = function(sequelize, DataTypes) {
  var ProductCategory = sequelize.define("ProductCategory", {
    CategoryId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER
  });

  ProductCategory.associate = function(models) {
    ProductCategory.belongsTo(models.Category);
    ProductCategory.belongsTo(models.Product);
  }

  return ProductCategory;
};
