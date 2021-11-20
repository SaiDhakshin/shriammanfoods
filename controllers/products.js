const pool = require('../util/database');
const Product = require('../models/products');
const GUser = require("../models/GUser");
const Order = require("../models/order");
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const { validationResult} = require('express-validator');

const CartShop = require('../models/cartshop');
const Sequelize = require('sequelize');

const nodemailer = require('nodemailer');

const location = require('../util/script');

var product = " ";
let prod_id = null;
var email = " ";
let ptitle=" ";



const sequelize = require('../util/database');
const { nextTick } = require('process');

exports.getAddProducts =(req,res)=>{
    const edit = false;
    console.log("GETADD");
    res.render("add-products" , {edit : edit});
}

exports.postAddProducts = async (req,res)=>{
    console.log(req.body);
    let{name,price,description,quantity} = req.body;
    let imageUrl = req.file;
    console.log(req.session.userId);
    GUser.findByPk(req.session.userId).then(res => {
        req.user = res;
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })

    if(!imageUrl){
        req.flash('success_msg', 'Attached file not a valid image');
        console.log('/admin/add-product works');
        res.redirect("/admin/add-products"); 
    }
    const imagePath = imageUrl.path;
    await Product.findAll({where : {title : name}}).then(products => {
        if(products[0] == null){

            req.user.createProduct({
                title : name,
                price : price,
                imageUrl : imagePath,
                description : description,
                quantity : quantity
            })
            //  Product.create({
            //     title : name,
            //     price : price,
            //     imageUrl : imageUrl,
            //     description : description,
            //     userId : req.user.id
            // })
            .then(result =>{
                console.log(result);
                console.log(result.dataValues);
                ptitle = result.dataValues.title;
                req.flash('success_msg',result.dataValues.title + ' Product successfully Added');
                console.log('/admin/add-product works');
                res.redirect("/admin/dashboard/add-products");  
            }).catch(err =>{
                console.log(err);
            })
        }else{
            req.flash('success_msg',ptitle + ' Product already exists');
                console.log('/admin/dashboard/add-product works');
                res.redirect("/admin/dashboard/add-products"); 
        }

    })
    .catch(err => {
        console.log(err);
    })
    // await pool.query("INSERT INTO product_table (name,price,imageUrl,description) VALUES ($1,$2,$3,$4) RETURNING *",[name,price,imageUrl,description],(err,res)=>{
    //     if(err){
    //         throw err;
    //     }
       
    // });
    
     
}

exports.getProducts =async (req,res)=>{
    console.log("getProducts ran" );
    // await pool.query("SELECT * FROM product_table",(err,result)=>{
    //     if(err){
    //         throw err;
    //     }
    //     if(result.rows.length > 0){
    //         console.log(result.rows);
    //         // products.push(result.rows);
    //         res.render('products',{products : result.rows});
    //     }
    // })
    await Product.findAll().then(products =>{
        // console.log(products);
        res.render('products',{products : products});
    }).catch(err=>{
        console.log(err);
    })
}

exports.getProductId =  async(req,res) =>{
    const edit = req.query.edit;
    const id = req.params.id;
    if(edit){
        await Product.findAll({where : {id : id}}).then(products =>{
            // console.log(products);
            res.render('add-products',{edit : edit , prods : products[0]});
        }).catch(err=>{
            console.log(err);
        })
        
    }else{
        const id = req.params.id;
    console.log(req.query);
    await Product.findAll({where : {id : id}}).then(products => {
        console.log(products);
        const product = products[0];
        res.render('productDetail',{p : product});
    }).catch(err=>{
        console.log(err);
    })
    }
    
}

exports.postEditProduct = async(req,res)=>{
    const edit = req.query.edit;
    if(edit){
        res.render('add-products',{edit : edit});
    }
    
}

exports.getCart = async(req,res) =>{
    // const cartProducts = CartShop.getCartProducts();
    GUser.findByPk(req.session.userId).then(res => {
        req.user = res;
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
    req.user.getCart()
    // Cart.findAll()
    .then(cart =>{
        return cart.getProducts()
        .then(prods =>{
            console.log( "carts "  + prods);
            res.render("cart",{p : prods});
        })
        .catch(err =>{
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
    
}

exports.postCart = async (req,res) => {
    console.log(req.body);
    GUser.findByPk(req.session.userId).then(res => {
        req.user = res;
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
    const id = req.body.id;
    console.log(id);
    let fetchedCart ;
    let newQuantity = 1;
    req.user.getCart()
    .then(cart =>{
        fetchedCart = cart;
        console.log(fetchedCart);
        return cart.getProducts({where : {id : id}});
    })
    .then(p =>{
        let product;
        if(p.length > 0){
            product = p[0];
        }
        
        if(product){
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
            return product;
        }
        return Product.findByPk(id)
        // .then(p =>{
        //     return fetchedCart.addProduct(p , { through  : { quantity : newQuantity }});
        // })
    })
        .then(p => {
            return fetchedCart.addProduct(p , { through  : { quantity : newQuantity }});
        })
        
        .then(() =>{
            console.log("Cart Redirect");
            req.flash('success_msg',' Product successfully Added');
            res.redirect("/products");
        })
        
        .catch(err =>{const id = req.body.id;
            console.log(id);
            let fetchedCart ;
            let newQuantity = 1;
            req.user.getCart()
            .then(cart =>{
                fetchedCart = cart;
                console.log(fetchedCart);
                return cart.getProducts({where : {id : id}});
            })
            console.log(err);
        })
   
        
    // Product.findById(id , (product) =>{
    //     Cart.addProduct(id , product.price);
    // })
}

exports.addCartQty = (req,res) => {
    GUser.findByPk(req.session.userId).then(res => {
        req.user = res;
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
    const id = req.body.id;
    console.log(id);
    let fetchedCart ;
    req.user.getCart()
    .then(cart =>{
        fetchedCart = cart;
        console.log(fetchedCart);
        return cart.getProducts({where : {id : id}});
    })
    .then(p =>{
        let product;
        if(p.length > 0){
            product = p[0];
        }
        
        if(product){
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
            return product;
        }
        return Product.findByPk(id)
        // .then(p =>{
        //     return fetchedCart.addProduct(p , { through  : { quantity : newQuantity }});
        // })
    })
        .then(p => {
            return fetchedCart.addProduct(p , { through  : { quantity : newQuantity }});
        })
        
        .then(() =>{
            console.log("Cart Redirect");
            req.flash('success_msg',' Qty successfully Added');
            res.redirect("/cart");
        })
        
        .catch(err =>{
            console.log(err);
        })
}

exports.removeQtyCart = (req,res) => {
    let noQty;
    GUser.findByPk(req.session.userId).then(res => {
        req.user = res;
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
    const id = req.body.id;
    console.log(id);
    let fetchedCart ;
    req.user.getCart()
    .then(cart =>{
        fetchedCart = cart;
        console.log(fetchedCart);
        return cart.getProducts({where : {id : id}});
    })
    .then(p =>{
        let product;
        if(p.length > 0){
            product = p[0];
        }
        
        if(product){
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity - 1;
            if(newQuantity < 1){
                product.cartItem.destroy();
            }
            return product;
        }
        return Product.findByPk(id)
        // .then(p =>{
        //     return fetchedCart.addProduct(p , { through  : { quantity : newQuantity }});
        // })
    })
        .then(p => {
 
                return fetchedCart.addProduct(p , { through  : { quantity : newQuantity }});

        })
        
        .then(() =>{
            console.log("Cart Redirect");
            req.flash('success_msg',' Qty successfully Deleted!');
            res.redirect("/cart");
        })
        
        .catch(err =>{
            console.log(err);
        })
}

exports.postDelete = async (req,res)=>{
    const id = req.params.id;
    await Product.findByPk(id).then(product =>{
        return product.destroy();
    }).then(result => {
        console.log("Product Deleted!");
        res.redirect('/products');
    })
    .catch(err => {
        console.log(err);
    })

    
}

exports.postUpdate = async (req,res) =>{
    const id = req.body.id;
    let{name,price,description} = req.body;
    let imageUrl = req.file;
    if(!imageUrl){
        req.flash("success_msg","Not a valid image");
        res.render('add-products',{edit : edit});
    }

    const imagePath = imageUrl.path;
    await Product.findByPk(id).then(product =>{
            product.title = name;
            product.price = price;
            product.imageUrl = imagePath;
            product.description = description;
             return product.save();
    })
    .then(result => {
        console.log("Updated product"  + result);
        res.redirect("/products");
    })
    .catch(err =>{
        console.log(err);
    })
}

exports.postOrder = (req,res) =>{
    GUser.findByPk(req.session.userId).then(res => {
        req.user = res;
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
    let fetchedCart;
    req.user.getCart()
    .then(cart =>{
        fetchedCart = cart;
        return cart.getProducts();
    })
    .then(products =>{
        return req.user.createOrder()
        .then(order =>{
            return order.addProducts(products.map(product =>{
                product.orderItem = { quantity : product.cartItem.quantity };
                return product;
            }))
        })
        .catch(err =>{
            console.log(err);
        })
    })
    .then(result => {
        console.log(result);
        console.log("Cart emptied");
        return fetchedCart.setProducts(null);
    })
    .then(result =>{
        res.redirect("/orders");
        
    })
    .catch(err =>{
        console.log(err);
    })
}

exports.getOrder = (req,res) =>{
    GUser.findByPk(req.session.userId).then(res => {
        req.user = res;
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
    req.user.getOrders({include : ['products']})
    .then(orders => {
        res.render("orders",{orders : orders});

    })
    .catch(err =>{
        console.log(err);
    })
}

exports.postItem = (req,res) => {
    console.log(req.body.product_name);
    product = req.body.product_name;
    console.log("Selected product" + product);
    prod_id = req.body.id;
    console.log("Getting product id here : " + prod_id);
    res.redirect("/auth/google");
}

exports.getAdminOrder = (req,res) => {
    res.render("itemOrder");
}

exports.getOrderItem = async (req,res) => {
    req.session.userId = req.user.id;
    if(req.user.email == "saidhakshin75@gmail.com"){
        res.redirect("/admin/dashboard");
    }else{
      
         Product.findByPk(prod_id).then(products => {
             console.log("Product quantity : " + products);
             res.render("itemOrder",{p : products , errors : null, location : location});

         })
         .catch(err => {
             console.log(err);
         })
    }
}

exports.postConfirm = async (req,res) => {
    // var regex=/^[a-zA-Z]+$/;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors.array());
        res.render("itemOrder",{errors : errors.array()[0]});
    }else{
        
        let {name , mobile_number , address , quantity } = req.body;
    
        // if(regex.match(name)){
        //     alert("Name contains numbers.");
        // }
        GUser.findByPk(req.session.userId).then(res => {
            req.user = res;
    
            email = res.email;
        })
        .catch(err => {
            console.log(err);
        })
        Product.findByPk(prod_id).then(result => {
            console.log(result.title);
            if( quantity > result.quantity){
                console.log("Quantity greater than available!");
                req.flash('err_msg','Entered Quantity greater than available!')
                res.redirect('/itemOrder');
            }else{
                console.log(GUser.email);
                console.log(product);
                req.user.createOrder({
                    name : name,
                    mobile_number  :  mobile_number,
                    address : address,
                    product : product,
                    quantity : quantity
                })
                .then(result =>{
                    console.log(result);
                    console.log(result.dataValues);
                    console.log(product);
                    res.render('confirm');
                }).catch(err =>{
                    console.log(err);
                })
                
                    let transporter =  nodemailer.createTransport({
                        service : "gmail",
                        port : 467,
                        secure : true,
                        auth : {
                            user : 'saidhakshin75@gmail.com',
                            pass : 'qmpzFGH4563',
                        },
                    });
                    
                    let options = {
                        to : req.user.email,
                        from : 'saidhakshin75@gmail.com',
                        subject : "Order",
                        text : 'Hello',
                        html : "<h2>Hello , Admin <br> The Order Details Are : <br> Name : " + name + " Mobile Number : " + mobile_number + "Address : " + address + 
                        "Product : " + product + "Quantity : " + quantity + ".<br> That's all folks!</h2>"
                    }
                
                     transporter.sendMail(options , (err,info) => {
                        if(err){
                            console.log(err);
                        }
                        console.log(info.response);
                    })
            }
        })
        .catch(err => {
            console.log(err);
        })
        
    }

    
    
}

exports.getAdminProducts = async (req,res) => {
    await Product.findAll().then(products =>{
        // console.log(products);
        req.user.isAdmin = true;
        console.log("IsAdmin : " + req.user.isAdmin);
        res.render('products',{products : products});
    }).catch(err=>{
        console.log(err);
    })
  
}

exports.getUpdate = async (req,res) => {
    const edit = true;
    const id = req.body.id;
    await Product.findAll({where : {id : id}}).then(products =>{
        // console.log(products);
        res.render('add-products',{edit : edit , prods : products[0]});
    }).catch(err=>{
        console.log(err);
    })
  
}

exports.getConfirmOrder = async (req,res) => {

    Order.findAll().then(orders => {
        console.log("All Orders" + orders);
        res.render("confirmOrder",{orders : orders});
    })
    .catch(err => {
        console.log(err);

    })

    // GUser.findByPk(req.session.userId).then(res => {
    //     req.user = res;
    //     console.log(res);
    // })
    // .catch(err => {
    //     console.log(err);
    // })
    // req.user.getOrders()
    // .then(orders => {
    //     console.log( "Orders here : " + orders);
    //     res.render("confirmOrder",{orders : orders});

    // })
    // .catch(err =>{
    //     console.log(err);
    // })
}

exports.getInvoice = (req,res,next) =>{
    const orderId = req.params.orderId;
    console.log(req.session.userId);
    Order.findByPk(orderId).then(order => {
        console.log(order);
        if(order.dataValues.guserId != req.session.userId){
            return (new Error("Unauthorized"));
        }
    }).catch(err => {
        throw(err);
    })
    const PDFDoc = new PDFDocument();
    const invoiceName = 'order-' + orderId + '.pdf';
    const invoicePath = path.join('invoices', invoiceName);

    res.setHeader('Content-Type' , 'application/pdf');
    res.setHeader('Content-Disposition' , 'inline; fileName="' + invoiceName + '"');

    PDFDoc.pipe(fs.createWriteStream(invoicePath));
    PDFDoc.pipe(res);

    Order.findByPk(orderId).then(order => {
        PDFDoc.fontSize(22).text('Invoice');
        PDFDoc.fontSize(14).text(order.dataValues.product + "X" + order.dataValues.quantity);
        PDFDoc.fontSize(20).text('Thanks for shopping');
        PDFDoc.end();
        
    }).catch(err => {
        throw(err);
    })

    
    
    // fs.readFile(invoicePath , (err,data) => {
    //     if(err){
    //         next(err);
    //     }
    //     res.setHeader('Content-Type' , 'application/pdf');
    //     res.setHeader('Content-Disposition' , 'attachment; fileName="' + invoiceName + '"');
    //     res.send(data);
    // })
   
  
   

}