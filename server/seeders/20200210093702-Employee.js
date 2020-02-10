'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkInsert('Employees', [{
        id: 1,
        email: 'admin@admin.com',
        password: '72c41692163d6d502dc65a53a82719df55157bbb',
        role: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        email: 'product-manage@admin.com',
        password: '72c41692163d6d502dc65a53a82719df55157bbb',
        role: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
 
      return queryInterface.bulkDelete('Employees', null, {});
  }
};
