const models = require("./../sequelize");
const Product = models.Product;

'use strict';
module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define('Category', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Category.associate(models) {
    Category.hasMany(Product, {foreignKey: "categoryId"});
  }

  return Category;
};