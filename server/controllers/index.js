const fs = require('fs');
const path = require('path');
let controller = {};

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    controller[file.substring(0, file.length - 3)] = require(path.join(__dirname, file));
  });

module.exports = controller;
