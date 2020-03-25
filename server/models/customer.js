'use strict';
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    thumbnail: DataTypes.TEXT,
    anonymous: DataTypes.INTEGER,
    address_delivery: DataTypes.JSONB
  }, {});
  Customer.associate = function(models) {
    Customer.hasMany(models.ProductReviews, {
      foreignKey: 'customer_info'
    })
    
    Customer.hasMany(models.BlogComment, {
      foreignKey: 'customer_info'
    })


  };
  return Customer;
};