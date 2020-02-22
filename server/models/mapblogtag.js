'use strict';
module.exports = (sequelize, DataTypes) => {
  const MapBlogTag = sequelize.define('MapBlogTag', {
    blog_id: DataTypes.INTEGER,
    tag_id: DataTypes.INTEGER
  }, {});
  MapBlogTag.associate = function(models) {
  };
  return MapBlogTag;
};