'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderDetails = sequelize.define('OrderDetails', {
    product_id: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER,
    real_price: DataTypes.FLOAT,
    amount: DataTypes.INTEGER
  }, {});
  OrderDetails.associate = function(models) {
    // associations can be defined here
  };
  return OrderDetails;
};