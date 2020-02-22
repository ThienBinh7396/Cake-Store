const express = require('express');
const router = express.Router();

const {
  BlogTagController,
  BlogController,
  EmployeeController,
  ProductController
} = require("./../controllers");
const Auth = require('../middlewares/auth');

router.get('/product/findAll', [ProductController.findAll]);

module.exports = router;