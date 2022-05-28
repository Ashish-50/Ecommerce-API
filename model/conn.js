const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const connection = ()=>{
    mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>{
        console.log("database connected")
    }).catch((err)=>{
        console.log(err)
    })
};

module.exports = connection;