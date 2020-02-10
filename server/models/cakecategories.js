'use strict';
module.exports = (sequelize, DataTypes) => {
  const CakeCategories = sequelize.define('CakeCategories', {
    title: DataTypes.STRING,
    thumbnail: DataTypes.STRING
  }, {});
  CakeCategories.associate = function(models) {
    // associations can be defined here
  };
  return CakeCategories;
};