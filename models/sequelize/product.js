"use strict";
module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define(
    "Product",
    {
      name: DataTypes.CHAR,
      description: DataTypes.CHAR,
      price: DataTypes.INTEGER,
      sku: DataTypes.INTEGER,
      img: DataTypes.CHAR,
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
