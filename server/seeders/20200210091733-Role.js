'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkInsert('Roles', [{
        id: 1,
        title: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        title: 'product-management',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        title: 'order-management',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkDelete('Roles', null, {});
  }
};
