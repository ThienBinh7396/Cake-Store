'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('BlogComments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      blog_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Blogs',
          key: 'id'
        }
      },
      content: {
        type: Sequelize.TEXT
      },
      customer_info: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('BlogComments');
  }
};

// customer_info(type: jsonb):
 
//  -anonymous:
//  *email
//  *phone

// -customer:
//  *customer_id
