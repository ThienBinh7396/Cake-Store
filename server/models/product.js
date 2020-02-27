'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    title: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    price: DataTypes.FLOAT,
    description: DataTypes.TEXT,
    short_description: DataTypes.TEXT,
    status: DataTypes.STRING,
    sold: DataTypes.INTEGER,
    discount: DataTypes.FLOAT,
    rate: DataTypes.FLOAT,
    employee_update_id: DataTypes.INTEGER
  }, {});
  Product.associate = function(models) {
    Product.hasMany(models.Gallery, {
      foreignKey: 'product_id'
    })

  };
  return Product;
};