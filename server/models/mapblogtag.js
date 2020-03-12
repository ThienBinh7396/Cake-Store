'use strict';
module.exports = (sequelize, DataTypes) => {
  const MapBlogTag = sequelize.define('MapBlogTag', {
    blog_id: DataTypes.INTEGER,
    tag_id: DataTypes.INTEGER
  }, {});
  MapBlogTag.associate = function(models) {
    MapBlogTag.belongsTo(models.BlogTags, {
      foreignKey: 'tag_id',
      targetKey: 'id'
    })

  };
  return MapBlogTag;
};