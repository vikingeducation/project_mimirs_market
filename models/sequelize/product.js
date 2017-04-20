'use strict';
module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define(
    'Product',
    {
      name: DataTypes.STRING,
      sku: DataTypes.INTEGER,
      description: DataTypes.STRING,
      price: DataTypes.DECIMAL,
      photo: DataTypes.STRING,
      unitsSold: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER
    },
    {
      classMethods: {
        associate: function(models) {
          Product.belongsTo(models.Category, {
            foreignKey: 'categoryId'
          });
        }
      }
    }
  );
  return Product;
};
