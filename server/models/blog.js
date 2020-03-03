"use strict";
module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define(
    "Blog",
    {
      upload_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      thumbnail: DataTypes.TEXT,
      status: DataTypes.INTEGER,
      views: DataTypes.JSONB
    },
    {}
  );
  Blog.associate = function(models) {
    Blog.belongsTo(models.Customer, {
      foreignKey: 'upload_id',
      targetKey: 'id'
    })

    Blog.belongsToMany(models.BlogTags, {
      through: "MapBlogTags",
      foreignKey: "blog_id",
      ortherKey: "tag_id"
    });
  };
  return Blog;
};
