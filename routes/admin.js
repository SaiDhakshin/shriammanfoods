const express = require('express');

const router = express.Router();

const productController = require("../controllers/products");

const authController = require("../controllers/auth");

router.get("/",authController.index);

router.get("/dashboard",authController.getAdminDashboard);

router.get("/auth/google",authController.authGoogle);

router.get("/auth/google/callback" ,authController.authGoogleCallBackAdmin);

router.get("/register",authController.getAdminRegister);

router.post("/login",authController.postAdminLogin);

router.get("/dashboard/add-products",productController.getAddProducts);

router.post("/dashboard/add-products",productController.postAddProducts);

router.post("/dashboard/delete/:id",productController.postDelete);

router.get("/dashboard/update",productController.getProductId);

router.post("/dashboard/update/:id",productController.getProductId);

router.post("/dashboard/updated",productController.postUpdate);

router.get("/dashboard/orders",productController.getOrder);

router.get("/dashboard/confirmOrders",productController.getConfirmOrder);

router.get("/dashboard/orders/:orderId",productController.getInvoice);

router.get("/dashboard/products",productController.getAdminProducts);

router.get("/dashboard/itemOrder",productController.getAdminOrder);

module.exports = router;