const models = require("./../sequelize");
const Category = models.Category;

"use strict";
module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define("Product", {
    name: DataTypes.STRING,
    sku: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    categoryId: DataTypes.INTEGER,
    inStock: DataTypes.INTEGER
  });

  Product.associate(models) {
    Product.belongsToOne(Category, {foreignKey: "categoryId"});
  }
  return Product;
};
