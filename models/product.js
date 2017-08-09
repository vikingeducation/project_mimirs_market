'use strict';
module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    picture: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    sku: DataTypes.STRING,
    description: DataTypes.STRING
  }
  Product.associate = function(models) {

    Product.belongsToMany(
      models.Categories,{ through: 'ProductsCategory'}
    )
  }
  });
  return Product;
};
