'use strict';
const models = require("./../models");

module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define('Category', {
    name: DataTypes.STRING
  }

  Category.associate = function(models) {
    Category.belongsToMany(
      models.Products,
      { through: {
        model:models.ProductsCategory,
        foreignKey: 'categoryId'
      }}
    )
  }
  });
  return Category;
};
