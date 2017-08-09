"use strict";
module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define("Product", {
    sku: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER
  });

  Product.associate = function(models) {
    Product.belongsToMany(models.Category, {through: models.ProductCategory});
    Product.hasMany(models.ProductCategory);
     Product.belongsToMany(models.User, {through: models.Cart});
    Product.hasMany(models.Cart);
  }

  return Product;
};
