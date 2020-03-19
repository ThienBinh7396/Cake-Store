'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
 
      return queryInterface.bulkInsert('Categories', [{
        title: 'Modern Cake',
        alias: 'Modern-Cake',
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        title: 'Gato Cake',
        alias: 'Gato-Cake',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Snickerdoodle',
        alias: 'Snickerdoodle',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Cupcake',
        alias: 'Cupcake',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Chocolate',
        alias: 'Chocolate',
        createdAt: new Date(),
        updatedAt: new Date()
      },], {});
  },

  down: (queryInterface, Sequelize) => {
  
      return queryInterface.bulkDelete('Categories', null, {});
  }
};
