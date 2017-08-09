'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    fname: DataTypes.STRING,
    lname: DataTypes.STRING,
   );
  return User;
};
