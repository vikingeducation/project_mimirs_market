"use strict";
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define("User", {
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  });

  User.associate = function(models) {
    User.hasMany(model.Order, {
      foreignKey: "userId"
    });
  };
  return User;
};
