const express = require('express');


const router = express.Router();

const productController = require('../controllers/products');

const Product = require('../models/products');

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

router.post("/orderConfirm",productController.postConfirm);

module.exports = router;