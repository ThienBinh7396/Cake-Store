'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    title: DataTypes.STRING,
    alias: DataTypes.STRING,
    thumbnail: DataTypes.TEXT
  }, {});
  Category.associate = function(models) {
    Category.hasMany(models.MapProductWithCategory, {
      foreignKey: 'category_id'
    })
    Category.belongsToMany(models.Product, {
      through: "MapProductWithCategory",
      foreignKey: "category_id",
      ortherKey: "product_id"
    })
  };
  return Category;
};