'use strict';
module.exports = (sequelize, DataTypes) => {
  const BlogTags = sequelize.define('BlogTags', {
    title: DataTypes.STRING,
    employee_update_id: DataTypes.INTEGER
  }, {});
  BlogTags.associate = function(models) {
    // associations can be defined here
  };
  return BlogTags;
};