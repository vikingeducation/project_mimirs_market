"use strict";
//var models = require("./../models");
module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define("Product", {
    CategoryId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    sku: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    imageUrl: DataTypes.STRING
  });

  // Product.associate = function(models) {
  //   Product.belongsTo(models.Category, {
  //     foreignKey: "categoryId"
  //   });
  // };

  Product.associate = function(models) {
    Product.belongsTo(models.Category);
  };

  return Product;
};
