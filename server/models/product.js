'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    title: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    description: DataTypes.TEXT,
    status: DataTypes.INTEGER,
    discount: DataTypes.FLOAT,
    employee_update_id: DataTypes.INTEGER
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
  };
  return Product;
};