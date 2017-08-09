"use strict";
module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define("Category", {
    name: DataTypes.STRING
  });

  Category.associate = function(models) {
    Category.belongsToMany(models.Product, {through: models.ProductCategory});
    Category.hasMany(models.ProductCategory);

  }

  return Category;
};
