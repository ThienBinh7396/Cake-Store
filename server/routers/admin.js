const express = require("express");
const router = express.Router();

const {
  BlogTagController,
  BlogController,
  EmployeeController,
  ProductController
} = require("./../controllers");

const adminAuth = require("../middlewares/admin");

const role = {
  all: {
    role: [1, 2, 3]
  },
  admin: {
    role: [1]
  },
  productManagement: {
    role: [1, 2]
  },
  orderManagement: {
    role: [1, 3]
  }
};

router.get("/", (req, res) => {
  res.send("API admin");
});

router.get("/employees/findAll", [
  adminAuth.verifyToken.bind(role.admin),
  EmployeeController.findAll
]);

router.post("/employees/updateByAdmin", [
  adminAuth.verifyToken.bind(role.admin),
  EmployeeController.updateByAdmin
]);
router.post("/employees/login", [EmployeeController.login]);
router.post("/employees/register", [EmployeeController.register]);

router.get("/products/findAll", [
  adminAuth.verifyToken.bind(role.productManagement),
  ProductController.findAll.bind(ProductController)
]);

router.post("/products/create", [
  adminAuth.verifyToken.bind(role.productManagement),
  ProductController.create.bind(ProductController)
]);

router.post("/products/update", [
  adminAuth.verifyToken.bind(role.productManagement),
  ProductController.update.bind(ProductController)
]);

router.post("/products/delete", [
  adminAuth.verifyToken.bind(role.productManagement),
  ProductController.delete.bind(ProductController)
]);

router.get("/blogTags/findAll", [BlogTagController.findAll]);

router.post("/blogTags/delete", [
  adminAuth.verifyToken.bind(role.productManagement),
  BlogTagController.delete
]);
router.post("/blogTags/create", [
  adminAuth.verifyToken.bind(role.productManagement),
  BlogTagController.create.bind(BlogTagController)
]);
router.post("/blogTags/update", [
  adminAuth.verifyToken.bind(role.productManagement),
  BlogTagController.update.bind(BlogTagController)
]);

router.get("/blog/findAll", [BlogController.findAll.bind(BlogController)]);
router.post("/blog/create", [
  adminAuth.verifyToken.bind(role.productManagement),
  BlogController.create.bind(BlogController)
]);
router.post("/blog/update", [
  adminAuth.verifyToken.bind(role.productManagement),
  BlogController.update.bind(BlogController)
]);
router.post("/blog/delete", [
  adminAuth.verifyToken.bind(role.productManagement),
  BlogController.delete.bind(BlogController)
]);

module.exports = router;
