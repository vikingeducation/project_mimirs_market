'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
   );
  }

  User.associate = function(models) {
    User.hasMany(models.Address);
    User.belongsToMany(models.Product, {through:models.Cart})
    User.hasMany(models.Cart)
  }

  return User;
};
