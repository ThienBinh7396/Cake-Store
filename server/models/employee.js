'use strict';
module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  }, {});
  Employee.associate = function(models) {

    Employee.belongsTo(models.Role, {
      foreignKey: 'role',
      targetKey: 'id'
    })
  };
  return Employee;
};