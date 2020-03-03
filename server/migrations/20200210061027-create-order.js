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
      // Ex: {type: anonymous, email: Ex..., phone: Ex...} 
      // {type: customer, customer_id: Ex...}
      customer_id: {
        type: Sequelize.INTEGER,
        reference: {
          model: 'Customer',
          key: 'id'
        }
      },
      total: {
        type: Sequelize.FLOAT
      },
      status: {
        type: Sequelize.INTEGER
      },
      address_delivery: {
        type: Sequelize.STRING
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