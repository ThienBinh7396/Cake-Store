const express = require('express');
const router = express.Router();

const {
  CustomerController,
  BlogTagController,
  BlogController,
  ProductController,
  FeedbackController,
  CategoryController,
  OrderController
} = require("./../controllers");
const Auth = require('../middlewares/auth');


router.post('/customer/checkExists', [CustomerController.checkExists.bind(CustomerController)]);

router.get('/category/findAll', [CategoryController.findAll.bind(CategoryController)]);

router.get('/product/newProducts', [ProductController.newProducts.bind(ProductController)]);
router.get('/product/topSell', [ProductController.topSell.bind(ProductController)]);
router.get('/product/findAll', [ProductController.findAll.bind(ProductController)]);
router.get('/product/topDiscounts', [ProductController.topDiscounts.bind(ProductController)]);
router.get('/product/filter', [ProductController.filter.bind(ProductController)]);
router.get('/product/findOne', [ProductController.findOne.bind(ProductController)])

router.post('/product/createComment', [ProductController.createComment.bind(ProductController)])

router.get('/feedback/show', [FeedbackController.getShow.bind(FeedbackController)]);

router.get('/blogTags/findAll', [BlogTagController.findAll]);

router.get('/blog/lastestBlogs', [BlogController.lastestBlog.bind(BlogController)]);
router.get('/blog/findOne', [BlogController.findOne.bind(BlogController)]);
router.get('/blog/filter', [BlogController.filter.bind(BlogController)]);
router.post('/blog/createComment', [BlogController.createComment.bind(BlogController)])

router.post('/order/create', [OrderController.create.bind(OrderController)]);

module.exports = router;