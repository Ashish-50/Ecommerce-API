const express = require('express');
const Order = require('../model/Order');
const router = express.Router();
const {verifyToken,verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('../routes/verifytoken');

// CREATE

router.post('/',verifyToken, async (req,res)=>{
    const newOrder = new Order(req.body)
    try {
        const savedorder = await newOrder.save();
        res.status(200).json(savedorder);
    } catch (error) {
        res.status(500).json(error)
    }
});//having error during adding new product




//UPDATE
router.put('/:id',verifyTokenAndAdmin,async(req,res)=>{
    try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true})
        res.status(200).json(updatedOrder);
    }
    catch(err){
        res.status(500).json(err);
    }
    
});

//  DELETE Cart
router.delete('/:id',verifyTokenAndAdmin,async(req,res)=>{
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted....")
    } catch (error) {
        res.status(500).json(error)
    }
});

//FIND Cart BY ID
router.get('/find/:userid',verifyTokenAndAdmin,async(req,res)=>{
    try {
        const Orders = await Order.findOne({userId:req.params.userid});
        
        res.status(200).json(Orders);
    } catch (error) {
        res.status(500).json(error)
    }
});

//GET ALL 
router.get('/',verifyTokenAndAdmin,async(req,res)=>{
    try {
        const Orders = await Order.find();
        res.status(200).json(Orders);
    } catch (error) {
        res.status(500).json(error)
    }
});



module.exports = router;