const express = require('express');
const Product = require('../model/Product');
const router = express.Router();
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('../routes/verifytoken');

// CREATE

router.post('/',verifyTokenAndAdmin, async (req,res)=>{
    const newProduct = new Product(req.body)
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json(error)
    }
});//having error during adding new product




//UPDATE
router.put('/:id',verifyTokenAndAdmin,async(req,res)=>{
    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedProduct);
    }
    catch(err){
        res.status(500).json(err);
    }
    
});

//  DELETE Product
router.delete('/:id',verifyTokenAndAdmin,async(req,res)=>{
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted....")
    } catch (error) {
        res.status(500).json(error)
    }
});

//FIND PRODUCT BY ID
router.get('/find/:id',async(req,res)=>{
    try {
        const user = await Product.findById(req.params.id);
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error)
    }
});

//GET ALL PRODUCT
router.get('/',async(req,res)=>{
    const qNew = req.query.new;
    const qCategory = req.query.Category;
    try {
        let products;
        if(qNew){
            products = await Product.find().sort({createdAt:-1}).limit(5)
        }
        else if(qCategory){
            products = await Product.find({categories:{
                $in:[qCategory],
            },
        })
        }else{
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error)
    }
});



module.exports = router;