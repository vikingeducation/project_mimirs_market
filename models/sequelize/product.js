"use strict";
//var models = require("./../models");
module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define("Product", {
    CategoryId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    sku: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT
  });
  Product.associate = function(models) {
    Product.belongsTo(models.Category, {
      foreignKey: "categoryId"
    });
  };
  return Product;
};
