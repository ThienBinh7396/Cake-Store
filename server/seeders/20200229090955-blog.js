"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Blogs",
      [
        {
          upload_id: -1,
          title: "Barbecue Party Tips For A Truly Amazing Event",
          content:
            "<p>No matter how far along you are in your sophistication as an amateur astronomer, there is always one fundamental moment that we all go back to. That is that very first moment that we went out where you could really see the cosmos well and you took in the night sky. For city dwellers, this is a revelation as profound as if we discovered aliens living among us. Most of us have no idea the vast panorama of lights that dot a clear night sky when there are no city lights to interfere with the view.</p><blockquote><p><i>It seems from the moment you begin to take your love of astronomy seriously, the thing that is on your mind is what kind of telescope will you get. And there is no question, investing in a good telescope can really enhance your enjoyment of your new passion in astronomy.</i></p><p>Rodney Cannon</p></blockquote><p>In the history of modern astronomy, there is probably no one greater leap forward than the building and launch of the space telescope known as the Hubble. While NASA has had many ups and downs, the launch and continued operation of the Hubble space telescope probably ranks next to the moon landings and the development of the Space Shuttle as one of the greatest space exploration accomplishments of the last hundred years.</p>",
          thumbnail:
            "https://cakes-store.herokuapp.com/uploads/2-29-2020/49a0e307818dfa869238ea8d46352c4d0e166bde.jpg",
          status: 1,
          createdAt: "2020-02-26T06:25:44.701Z",
          updatedAt: "2020-02-29T09:08:48.659Z"
        },
        {
          upload_id: -1,
          title: "Barbecue Party Tips For A Truly Amazing Event",
          content:
            "<p>No matter how far along you are in your sophistication as an amateur astronomer, there is always one fundamental moment that we all go back to. That is that very first moment that we went out where you could really see the cosmos well and you took in the night sky. For city dwellers, this is a revelation as profound as if we discovered aliens living among us. Most of us have no idea the vast panorama of lights that dot a clear night sky when there are no city lights to interfere with the view.</p><blockquote><p><i>It seems from the moment you begin to take your love of astronomy seriously, the thing that is on your mind is what kind of telescope will you get. And there is no question, investing in a good telescope can really enhance your enjoyment of your new passion in astronomy.</i></p><p>Rodney Cannon</p></blockquote><p>In the history of modern astronomy, there is probably no one greater leap forward than the building and launch of the space telescope known as the Hubble. While NASA has had many ups and downs, the launch and continued operation of the Hubble space telescope probably ranks next to the moon landings and the development of the Space Shuttle as one of the greatest space exploration accomplishments of the last hundred years.</p>",
          thumbnail:
            "https://cakes-store.herokuapp.com/uploads/2-29-2020/301dd5eec9871f2e1a94094bfe59be5c5d4eadd1.jpg",
          status: 1,
          createdAt: "2020-02-26T06:27:23.159Z",
          updatedAt: "2020-02-29T09:08:36.831Z"
        },
        {
          upload_id: -1,
          title: "Where I Learning Cook Cupcakes ?",
          content:
            "<p>No matter how far along you are in your sophistication as an amateur astronomer, there is always one fundamental moment that we all go back to. That is that very first moment that we went out where you could really see the cosmos well and you took in the night sky. For city dwellers, this is a revelation as profound as if we discovered aliens living among us. Most of us have no idea the vast panorama of lights that dot a clear night sky when there are no city lights to interfere with the view.</p><blockquote><p><i>It seems from the moment you begin to take your love of astronomy seriously, the thing that is on your mind is what kind of telescope will you get. And there is no question, investing in a good telescope can really enhance your enjoyment of your new passion in astronomy.</i></p><p>Rodney Cannon</p></blockquote><p>In the history of modern astronomy, there is probably no one greater leap forward than the building and launch of the space telescope known as the Hubble. While NASA has had many ups and downs, the launch and continued operation of the Hubble space telescope probably ranks next to the moon landings and the development of the Space Shuttle as one of the greatest space exploration accomplishments of the last hundred years.</p>",
          thumbnail:
            "https://cakes-store.herokuapp.com/uploads/2-29-2020/fe570cb54dfb19b89bf037484c041a14c4b41bf7.jpg",
          status: 0,
          createdAt: "2020-02-26T08:35:50.703Z",
          updatedAt: "2020-02-29T09:08:22.046Z"
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("People", null, {});
  }
};
