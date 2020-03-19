'use strict';
module.exports = (sequelize, DataTypes) => {
  const BlogComment = sequelize.define('BlogComment', {
    blog_id: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    customer_info: DataTypes.INTEGER
  }, {});
  BlogComment.associate = function(models) {
    BlogComment.belongsTo(models.Customer, {
      foreignKey: "customer_info"
    });
  };
  return BlogComment;
};