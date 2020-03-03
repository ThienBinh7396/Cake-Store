'use strict';
module.exports = (sequelize, DataTypes) => {
  const MapProductWithCategory = sequelize.define('MapProductWithCategory', {
    category_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER
  }, {});
  MapProductWithCategory.associate = function(models) {
    MapProductWithCategory.belongsTo(models.Category, {
      foreignKey: 'category_id',
      targetKey: 'id'
    })
  };
  return MapProductWithCategory;
};