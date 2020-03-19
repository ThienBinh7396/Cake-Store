"use strict";
module.exports = (sequelize, DataTypes) => {
  const ProductReviews = sequelize.define(
    "ProductReviews",
    {
      product_id: DataTypes.INTEGER,
      customer_info: DataTypes.INTEGER,
      parent_id: DataTypes.INTEGER,
      rate: DataTypes.FLOAT,
      content: DataTypes.TEXT
    },
    {}
  );
  ProductReviews.associate = function(models) {
    ProductReviews.belongsTo(models.Customer, {
      foreignKey: "customer_info"
    });

    ProductReviews.belongsTo(models.Product, {
      foreignKey: "product_id",
      targetKey: "id",
      required: false
    });
    ProductReviews.hasMany(ProductReviews, {
      as: "children",
      foreignKey: "parent_id",
      required: false

    });
  };
  return ProductReviews;
};
