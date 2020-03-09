'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
  
      return queryInterface.bulkInsert('BlogTags', [{
        id: 1,
        title: 'Recipes',
        alias: 'recipes',
        employee_update_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        title: 'Promos Food',
        alias: 'Promos-Food',
        employee_update_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('BlogTags', null, {});
  }
};
