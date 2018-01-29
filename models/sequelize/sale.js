'use strict';
module.exports = (sequelize, DataTypes) => {
  var sale = sequelize.define('sale', {
    item_id: DataTypes.STRING,
    category: DataTypes.STRING,
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return sale;
};
