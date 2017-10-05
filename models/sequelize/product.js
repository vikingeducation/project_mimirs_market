"use strict";

module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define("Product", {
    name: DataTypes.STRING,
    sku: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING,
    categoryId: DataTypes.INTEGER
  });
  Product.associate = function(models) {
    // associations can be defined here
    this.belongsTo(models.Category, { foreignKey: "categoryId" });
  };
  return Product;
};
