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
  Product.priceRange = function(selectedMin, selectedMax) {
    let steps = 30;
    return Promise.all([
      this.min("price"),
      this.max("price")
    ]).then(([min, max]) => {
      let increment = (max - min) / steps;
      let range = [];
      for (let i = 0; i <= steps; i++) {
        let step = Math.round(min + i * increment);
        range.push({
          value: step,
          pretty: step.toLocaleString("en-US", {
            style: "currency",
            currency: "USD"
          }),
          min: step == selectedMin,
          max: step == selectedMax
        });
      }
      return range;
    });
  };
  return Product;
};
