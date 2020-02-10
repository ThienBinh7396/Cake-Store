'use strict';
module.exports = (sequelize, DataTypes) => {
  const FavoriteListDetails = sequelize.define('FavoriteListDetails', {
    product_id: DataTypes.INTEGER,
    favorite_list_id: DataTypes.INTEGER
  }, {});
  FavoriteListDetails.associate = function(models) {
    // associations can be defined here
  };
  return FavoriteListDetails;
};