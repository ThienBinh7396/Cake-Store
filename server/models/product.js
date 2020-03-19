'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    title: DataTypes.STRING,
    thumbnail: DataTypes.TEXT,
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

    Product.hasMany(models.ProductReviews, {
        foreignKey: 'product_id',
        required: false
    });

    Product.belongsToMany(models.Category, {
      through: "MapProductWithCategory",
      ortherKey: "category_id",
      foreignKey: "product_id"
    })

  };
  return Product;
};