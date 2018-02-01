'use strict';
module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    sku: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    img: DataTypes.STRING,
    categoryId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Product;
};
