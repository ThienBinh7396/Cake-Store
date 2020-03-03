'use strict';
module.exports = (sequelize, DataTypes) => {
  const Gallery = sequelize.define('Gallery', {
    product_id: DataTypes.INTEGER,
    url: DataTypes.TEXT
  }, {});
  Gallery.associate = function(models) {
    // associations can be defined here
  };
  return Gallery;
};