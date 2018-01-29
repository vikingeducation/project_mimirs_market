'use strict';
module.exports = (sequelize, DataTypes) => {
  var order = sequelize.define('order', {
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    state: DataTypes.STRING,
    order_total: DataTypes.STRING,
    stripe_token: DataTypes.STRING,
    token_type: DataTypes.STRING,
    card_id: DataTypes.STRING,
    card_brand: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return order;
};
