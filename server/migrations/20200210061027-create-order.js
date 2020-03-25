'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_code: {
        type: Sequelize.STRING
      },
      customer_id: {
        type: Sequelize.INTEGER,
        reference: {
          model: 'Customer',
          key: 'id'
        }
      },
      note: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.INTEGER,
        default: 0
      },
      address_delivery: {
        type: Sequelize.JSONB
      },
      payment_info: {
        type: Sequelize.JSONB
      },
      employee_update_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Customers',
          key: 'id'
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
    return queryInterface.dropTable('Orders');
  }
};