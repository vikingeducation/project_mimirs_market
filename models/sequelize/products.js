"use strict";
module.exports = (sequelize, DataTypes) => {
	var Products = sequelize.define("Products", {
		name: DataTypes.STRING,
		sku: DataTypes.STRING,
		description: DataTypes.STRING,
		price: DataTypes.INTEGER,
		categoryId: DataTypes.INTEGER
	});

	Products.associate = function(models) {
		Products.belongsTo(models.Categories, {
			foreignKey: "categoryId"
		});
	};
	return Products;
};
