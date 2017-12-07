"use strict";
module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define("Product", {
    name: DataTypes.STRING,
    sku: DataTypes.INTEGER,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  });

  Product.associate = function(models) {
    Product.belongsTo(models.Category, {
      foreignKey: "categoryId"
    });
  };

  return Product;
};
