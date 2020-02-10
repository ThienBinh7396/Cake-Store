'use strict';
module.exports = (sequelize, DataTypes) => {
  const BlogComment = sequelize.define('BlogComment', {
    blog_id: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    customer_info: DataTypes.JSON
  }, {});
  BlogComment.associate = function(models) {
    // associations can be defined here
  };
  return BlogComment;
};