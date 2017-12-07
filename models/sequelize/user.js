'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  });

  User.associate = function(models) {
    User.hasMany(models.Order, {
      foreignKey: 'userId',
    });
  };
  return User;
};
