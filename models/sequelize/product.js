"use strict";
module.exports = function(sequelize, DataTypes) {
  const Product = sequelize.define("Product", {
    sku: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    CategoryId: DataTypes.INTEGER
  });
  Product.associate = function(models) {
    Product.belongsTo(models.Category);
  };
  return Product;
};
