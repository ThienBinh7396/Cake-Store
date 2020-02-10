'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductReviews = sequelize.define('ProductReviews', {
    product_id: DataTypes.INTEGER,
    customer_info: DataTypes.JSONB,
    content: DataTypes.TEXT
  }, {});
  ProductReviews.associate = function(models) {
    // associations can be defined here
  };
  return ProductReviews;
};