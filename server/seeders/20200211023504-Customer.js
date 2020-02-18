'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
  
      return queryInterface.bulkInsert('Customers', [{
        id: 1,
        name: 'John Doe',
        email: 'demo@demo.com',
        password: '72c41692163d6d502dc65a53a82719df55157bbb',
        phone: '012345678',
        address: 'Hai Phong',
        anonymous: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        email: 'anonymous12@demo.com',
        password: '72c41692163d6d502dc65a53a82719df55157bbb',
        phone: '012345678',
        address: 'Hai Phong',
        anonymous: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Customers', null, {});
  }
};
