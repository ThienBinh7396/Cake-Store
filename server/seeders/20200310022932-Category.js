'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
 
      return queryInterface.bulkInsert('Categories', [{
        title: 'Modern Cake',
        alias: 'Modern-Cake',
      },{
        title: 'Gato Cake',
        alias: 'Gato-Cake',
      },
      {
        title: 'Snickerdoodle',
        alias: 'Snickerdoodle',
      },
      {
        title: 'Cupcake',
        alias: 'Cupcake',
      },
      {
        title: 'Chocolate',
        alias: 'Chocolate',
      },], {});
  },

  down: (queryInterface, Sequelize) => {
  
      return queryInterface.bulkDelete('Categories', null, {});
  }
};
