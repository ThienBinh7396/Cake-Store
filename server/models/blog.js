'use strict';
module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define('Blog', {
    upload_id: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    thumbnail: DataTypes.STRING,
    views: DataTypes.JSONB,
    tags: DataTypes.JSONB
  }, {});
  Blog.associate = function(models) {
    // associations can be defined here
  };
  return Blog;
};