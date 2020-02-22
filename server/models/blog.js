"use strict";
module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define(
    "Blog",
    {
      upload_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      thumbnail: DataTypes.STRING,
      status: DataTypes.INTEGER,
      views: DataTypes.JSONB
    },
    {}
  );
  Blog.associate = function(models) {
    Blog.belongsToMany(models.BlogTags, {
      through: "MapBlogTags",
      foreignKey: "blog_id",
      ortherKey: "tag_id"
    });
  };
  return Blog;
};
