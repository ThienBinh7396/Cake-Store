'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      return queryInterface.bulkInsert('Feedbacks', [
        {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        thumbnail: 'http://warethemes.com/wordpress/bakery/wp-content/uploads/2017/06/3.jpg',
        show: true,
        rate: Math.random() * 2 + 3,
        content: 'Dessert pudding dessert jelly beans cupcake sweet caramels gingerbread. Fruitcake biscuit cheesecake. Cookie topping sweet muffin pudding tart bear claw sugar plum croissant.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
        {
        name: 'Logan May',
        email: 'johndoe@gmail.com',
        thumbnail: 'http://warethemes.com/wordpress/bakery/wp-content/uploads/2017/06/5.jpg',

        show: false,
        rate: Math.random() * 2 + 3,
        content: 'Dessert pudding dessert jelly beans cupcake sweet caramels gingerbread. Fruitcake biscuit cheesecake. Cookie topping sweet muffin pudding tart bear claw sugar plum croissant.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
        {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        thumbnail: 'http://warethemes.com/wordpress/bakery/wp-content/uploads/2017/06/1.jpg',
        show: true,
        rate: Math.random() * 2 + 3,
        content: 'Dessert pudding dessert jelly beans cupcake sweet caramels gingerbread. Fruitcake biscuit cheesecake. Cookie topping sweet muffin pudding tart bear claw sugar plum croissant.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
        {
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        show: true,
        rate: Math.random() * 2 + 3,
        content: 'Dessert pudding dessert jelly beans cupcake sweet caramels gingerbread. Fruitcake biscuit cheesecake. Cookie topping sweet muffin pudding tart bear claw sugar plum croissant.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
        {
        name: 'Logan May - CEO & Founder Invision',
        email: 'johndoe@gmail.com',
        show: true,
        rate: Math.random() * 2 + 3,
        content: 'Dessert pudding dessert jelly beans cupcake sweet caramels gingerbread. Fruitcake biscuit cheesecake. Cookie topping sweet muffin pudding tart bear claw sugar plum croissant.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
   
      return queryInterface.bulkDelete('Feedbacks', null, {});
  }
};
