'use strict';
module.exports = (sequelize, DataTypes) => {
  const BlogTags = sequelize.define('BlogTags', {
    title: DataTypes.STRING,
    alias: DataTypes.STRING,
    employee_update_id: DataTypes.INTEGER
  }, {});
  BlogTags.associate = function(models) {
    BlogTags.belongsTo(models.Employee, {
      foreignKey: 'employee_update_id',
      targetKey: 'id'
    });

    BlogTags.belongsToMany(models.Blog, {
      through: "MapBlogTags",
      foreignKey: "tag_id",
      ortherKey: "blog_id"
    });

  };
  return BlogTags;
};