const express = require("express");
const router = express.Router();

const {
  BlogTagController,
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
  adminAuth.verifyToken.bind(role.all),
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
  ProductController.findAll
]);

router.post("/products/create", [
  adminAuth.verifyToken.bind(role.productManagement),
  ProductController.create.bind(ProductController)
]);

router.post("/products/update", [
  adminAuth.verifyToken.bind(role.productManagement),
  ProductController.update.bind(ProductController)
]);

router.get("/blogs/findByTag", [BlogTagController.findByTags]);

module.exports = router;
