"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("ProductReviews", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Products",
          key: "id"
        }
      },
      customer_info: {
        type: Sequelize.INTEGER,
        references: {
          model: "Customers",
          key: "id"
        }
      },
      parent_id: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      rate: {
        type: Sequelize.FLOAT
      },
      content: {
        type: Sequelize.TEXT
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
    return queryInterface.dropTable("ProductReviews");
  }
};
