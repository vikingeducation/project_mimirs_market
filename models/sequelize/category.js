"use strict";
module.exports = (sequelize, DataTypes) => {
  var Category = sequelize.define("Category", {
    name: DataTypes.STRING,
    categoryId: DataTypes.INTEGER
  });

  Category.associate = function(models) {
    Category.hasMany(model.Product, {
      foreignKey: "categoryId"
    });
  };

  return Category;
};
