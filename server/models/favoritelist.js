'use strict';
module.exports = (sequelize, DataTypes) => {
  const FavoriteList = sequelize.define('FavoriteList', {
    customer_id: DataTypes.INTEGER
  }, {});
  FavoriteList.associate = function(models) {
    // associations can be defined here
  };
  return FavoriteList;
};