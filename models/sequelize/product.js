const models = require("./../sequelize");

("use strict");
module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define("Product", {
    name: DataTypes.STRING,
    sku: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    categoryId: DataTypes.INTEGER,
    inStock: DataTypes.INTEGER
  });

  Product.associate = function(models) {
    Product.belongsTo(models.Category, { foreignKey: "categoryId" });
  };
  return Product;
};
