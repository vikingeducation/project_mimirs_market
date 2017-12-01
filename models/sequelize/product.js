'use strict';
module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    sku: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    categoryId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Product.belongsTo(models.Category, {
          foreignKey: 'categoryId'
        });
      }
    }
  });
  return Product;
};