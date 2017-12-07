'use strict';
module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    categoryId: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    description: DataTypes.STRING,
  });

  Product.associate = function(models) {
    // associations can be defined here
    Product.hasOne(models.Category, {
      foreignKey: 'id',
    });
  };

  return Product;
};
