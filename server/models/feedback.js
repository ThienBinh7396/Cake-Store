'use strict';
module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    thumbnail: DataTypes.TEXT,
    content: DataTypes.TEXT,
    rate: DataTypes.FLOAT
  }, {});
  Feedback.associate = function(models) {
    // associations can be defined here
  };
  return Feedback;
};