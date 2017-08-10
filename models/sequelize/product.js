"use strict";
module.exports = function(sequelize, DataTypes) {
  const Product = sequelize.define("Product", {
    sku: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.INTEGER,
    CategoryId: DataTypes.INTEGER,
    prettyPrice: {
      type: DataTypes.VIRTUAL,
      get: function() {
        return this.price.toLocaleString("en-US", {
          style: "currency",
          currency: "USD"
        });
      }
    }
  });
  Product.associate = function(models) {
    Product.belongsTo(models.Category);
  };
  return Product;
};
