"use strict";
module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define(
    "Product",
    {
      name: DataTypes.CHAR,
      description: DataTypes.CHAR,
      imageUrl: DataTypes.CHAR,
      price: DataTypes.INTEGER,
      sku: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER
    },
    {
      classMethods: {}
    }
  );
  Product.associate = function(models) {
    Product.belongsTo(models.Category, {
      foreignKey: "categoryId"
    });
  };
  return Product;
};
