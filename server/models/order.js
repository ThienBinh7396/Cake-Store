'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    order_code: DataTypes.STRING,
    customer_id: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    address_delivery: DataTypes.TEXT,
    payment_info: DataTypes.TEXT,
    note: DataTypes.TEXT,
    employee_update_id: DataTypes.INTEGER
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
  };
  return Order;
};