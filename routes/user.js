const express = require('express');


const router = express.Router();

const productController = require('../controllers/products');

const Product = require('../models/products');

const { check } = require('express-validator/check');

function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect("/dashboard");
    }
    next();
}

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

router.get("/", async (req,res) => {
    await Product.findAll().then(products =>{
        // console.log(products);
        console.log(products);
        res.render('home2',{products : products});
    }).catch(err=>{
        console.log(err);
    })
  
})

router.get("/products",productController.getProducts);

router.get("/products/:id",productController.getProductId);



router.get("/cart",productController.getCart);

router.post("/cart",productController.postCart);

router.post("/addQtyCart",productController.addCartQty);

router.post("/removeQtyCart",productController.removeQtyCart);

router.post("/createorder",productController.postOrder);

router.get("/orders",productController.getOrder);

//real-time routes
router.post("/item",productController.postItem);

router.get("/itemOrder",productController.getOrderItem);

router.post("/orderConfirm", check('name').isAlphanumeric().matches(/^[a-zA-Z]+$/).withMessage("Not a valid Name."),
check('mobile_number').matches(/^[0-9]/).isLength({min : 10}).withMessage("Not a valid mobile number"),

productController.postConfirm);

module.exports = router;