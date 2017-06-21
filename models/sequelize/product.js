'use strict';
module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    SKU: DataTypes.INTEGER,
    description: DataTypes.TEXT('medium'),
    price: DataTypes.DECIMAL,
    categoryID: DataTypes.INTEGER,
    image: DataTypes.STRING,
    quantity: DataTypes.INTEGER
  });

  Product.associate = function(models) {
    Product.belongsTo(models.Category, {
      foreignKey: "categoryID"
    });
  };

  return Product;
};
