'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    order_code: DataTypes.STRING,
    customer_id: DataTypes.INTEGER,
    total: DataTypes.FLOAT,
    status: DataTypes.INTEGER,
    address_delivery: DataTypes.STRING,
    employee_update_id: DataTypes.INTEGER
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
  };
  return Order;
};