const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const connection = require('./model/conn');
const morgan = require('morgan');
const helmet = require('helmet');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const orderRoute = require('./routes/order');
const cartRoute = require('./routes/cart');


app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//CORS - Cross-Origin-Resource-Sharing
// if both client and the server are on same server let's say localhost:3000
//then Cors simply allow them to transfer data but
//if any of them not on same server let say server want to get resource from any other origin or server then 
// cors will not allow them to access the data it is act like authentication
// but in api case  server and client server are different but api are meant to fetch data from other resources and give to us so a API has to access all the origin so
//we have to set cors for allowcation as below

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin',"*"); //access-control-allow-origin means it will allow by the browser and * means anyone can access
    res.header('Access-Control-Allow-Header','Origin,X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT, POST, GET,PATCH,DELETE');
        return res.status(200).json({});
    }
    next();
});


app.use('/api/auth',authRoute);
app.use('/api/user',userRoute);
app.use('/api/products',productRoute);
app.use('/api/orders',orderRoute);
app.use('/api/cart',cartRoute);

app.use((req,res,next)=>{
    const error = new Error("Not Found");
    error.status=404;
    next(error);
});
app.use((error,req,res,next)=>{
    res.status(error.status|| 500);
    res.json({
        error:{
            message:error.message
        }
    })
});


app.listen(process.env.PORT || 5000,()=>{
    console.log(`server started at port ${process.env.PORT}`);
    connection();
});
