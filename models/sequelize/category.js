"use strict";
module.exports = (sequelize, DataTypes) => {
  var Category = sequelize.define("Category", {
    name: DataTypes.STRING
  });

  Category.CategoryName = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  Category.associate = function(models) {
    Category.hasMany(models.Product, {
      foreignKey: "categoryId"
    });
  };

  return Category;
};
