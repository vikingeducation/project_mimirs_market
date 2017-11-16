"use strict";
module.exports = (sequelize, DataTypes) => {
	var Categories = sequelize.define("Categories", {
		name: DataTypes.STRING
	});

	Categories.associate = function(models) {
		Categories.hasMany(models.Products, {
			foreignKey: "categoryId"
		});
	};
	return Categories;
};
