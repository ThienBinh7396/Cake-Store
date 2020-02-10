'use strict';
module.exports = (sequelize, DataTypes) => {
  const TransactionDetails = sequelize.define('TransactionDetails', {
    product_id: DataTypes.INTEGER,
    transaction_id: DataTypes.INTEGER,
    real_price: DataTypes.FLOAT,
    amount: DataTypes.INTEGER
  }, {});
  TransactionDetails.associate = function(models) {
    // associations can be defined here
  };
  return TransactionDetails;
};