'use strict';
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    thumbnail: DataTypes.STRING
  }, {});
  Customer.associate = function(models) {
    // associations can be defined here
  };
  return Customer;
};