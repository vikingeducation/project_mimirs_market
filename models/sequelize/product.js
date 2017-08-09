"use strict";
module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define("Product", {
    sku: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER
  });
  return Product;
};
