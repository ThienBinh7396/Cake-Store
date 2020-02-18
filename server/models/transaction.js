'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    transaction_code: DataTypes.STRING,
    customer_id: DataTypes.INTEGER,
    total: DataTypes.FLOAT,
    status: DataTypes.INTEGER,
    address_delivery: DataTypes.STRING,
    employee_update_id: DataTypes.INTEGER
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
  };
  return Transaction;
};