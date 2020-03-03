"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      thumbnail: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.FLOAT
      },
      description: {
        type: Sequelize.TEXT
      },
      short_description: {
        type: Sequelize.TEXT,
        defaultValue: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.'
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: "available"
      },
      discount: {
        type: Sequelize.FLOAT
      },
      sold: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      rate: {
        type: Sequelize.FLOAT,
        defaultValue: 5
      },
      employee_update_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Customers",
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Products");
  }
};
