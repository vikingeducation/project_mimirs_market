'use strict';
const models = require("./../models");

module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define('Category', {name: DataTypes.STRING}

  Category.associate = function(models) {
    Category.hasMany(models.ProductsCategory, {foreignKey: 'categoryId'});
    Category.belongsToMany(models.Product, {
      through: models.ProductsCategory,
      foreignKey: 'categoryId'
    })
  }
});
return Category;
};
