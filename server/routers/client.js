const express = require('express');
const router = express.Router();

const {
  BlogTagController,
  BlogController,
  EmployeeController,
  ProductController,
  FeedbackController,
  CategoryController
} = require("./../controllers");
const Auth = require('../middlewares/auth');


router.get('/category/findAll', [CategoryController.findAll.bind(CategoryController)]);

router.get('/product/newProducts', [ProductController.newProducts.bind(ProductController)]);
router.get('/product/topSell', [ProductController.topSell.bind(ProductController)]);
router.get('/product/findAll', [ProductController.findAll.bind(ProductController)]);
router.get('/product/topDiscounts', [ProductController.topDiscounts.bind(ProductController)]);
router.get('/product/filter', [ProductController.filter.bind(ProductController)]);
router.get('/product/findOne', [ProductController.findOne.bind(ProductController)])

router.get('/feedback/show', [FeedbackController.getShow.bind(FeedbackController)]);

router.get('/blog/lastestBlogs', [BlogController.lastestBlog.bind(BlogController)]);

module.exports = router;