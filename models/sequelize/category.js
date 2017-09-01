"use strict";
module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define(
    "Category",
    {
      name: DataTypes.CHAR
    },
    {
      classMethods: {}
    }
  );
  Category.associate = function(models) {
    Category.hasMany(models.Product, {
      foreignKey: "categoryId"
    });
  };
  return Category;
};
