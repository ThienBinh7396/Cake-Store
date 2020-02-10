'use strict';
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.INTEGER
  }, {});
  Employee.associate = function(models) {
    // associations can be defined here
  };
  return Employee;
};