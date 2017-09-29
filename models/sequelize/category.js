"use strict";
var Products = require("./../sequelize/product");

module.exports = (sequelize, DataTypes) => {
  var Category = sequelize.define("Category", {
    name: DataTypes.STRING
  });
  Category.associate = function(models) {
    // associations can be defined here
    this.hasMany(Products, { foreignKey: "categoryId" });
  };
  return Category;
};
