'use strict';
module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('Feedback', {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    content: DataTypes.TEXT,
    rate: DataTypes.FLOAT
  }, {});
  Feedback.associate = function(models) {
    // associations can be defined here
  };
  return Feedback;
};