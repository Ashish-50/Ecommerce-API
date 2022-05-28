const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../model/User')
const jwt = require('jsonwebtoken');

//register
router.post('/register',async(req,res)=>{

    //write validation like enter username email 
    const newUser = new User({
        username:req.body.username,
        email:req.body.email,
        isAdmin:req.body.isAdmin,
        password:await bcrypt.hash(req.body.password,10),
    });
    try {
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (error) {
        res.status(500).json(error)
    }
});

//LOGIN
router.post('/login',async(req,res)=>{
    try {
        const username = req.body.username
        const password = req.body.password
        const user =await User.findOne({username:username})
        if(!user){
            res.status(401).json("Wrong Credentials")
        }
        else{
            const isMatch = await bcrypt.compare(password,user.password);
            //generating tokens
            const accessToken =  jwt.sign({
                id:user._id,isAdmin:user.isAdmin
            },
            process.env.JWTSECRET,
            {expiresIn:process.env.EXPIRE
            });

            // const {password,...others}=user._doc;
            if(isMatch){
                res.status(200).json({
                    _id:user._id,
                    username:user.username,
                    email:user.email,
                    isAdmin:user.isAdmin,
                    createdAt:user.createdAt,
                    updatedAt:user.updatedAt,
                    token:accessToken
                });
            }
            else{
                res.status(401).json("Wrong Credentials")
            }
        }
    } catch (error) {
        res.status(500).json(error) 
    }
})


module.exports = router;