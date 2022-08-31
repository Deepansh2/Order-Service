const jwt = require("jsonwebtoken")
const authConfig = require("../configs/auth.config");
const User = require("../models/user.model");
const constants = require("../utils/constant")
const Order = require("../models/order.model")

const verifyToken = (req,res,next) =>{

    const token  =  req.headers["x-access-token"];

    if(!token){
        return res.status(403).send({
            massage : "No token Provided"
        })
    }

    jwt.verify(token,authConfig.secret,(err,decoded) =>{
        if(err){
            return res.status(403).send({
                message : "unauthorized !"
            })
        }
        req.userId = decoded.id;

        next()
    })
}

const isAdmin = async (req,res,next) =>{
    const user = await User.findOne({userId:req.userId});

    if(user == null){
        return res.status(200).send({
            message : "UserId passed doesn't exist"
        })
    }
    if(user.userType == constants.userTypes.admin){
        next()
    }else{
        return res.status(403).send({
            message : "Probhited ! only ADMIN can access"
        })
    }
}

const isValidCustomerOrAdmin = (req,res,next) =>{

    try{

    const user = await User.findOne({userId:req.userId});

    console.log(req.userId,user,"isValidCustomerOrAdmin")
    const order  = await Order.findOne({_id:req.params.id})
    if(user.userType != constants.userTypes.admin){
        if(user._id.valueOf() != order.customerId.valueOf()){
            return res.status(403).send({
                message: "Only admin | owner are allowed to access this endPoint"
            })
        }
    }
    next()
}catch(err){
    console.log("Error while validating userId",err.message);
    return res.status(500).send({
        message: "Some Internal server error"
    })
}
}

const authJwt = {
    verifyToken:verifyToken,
    isAdmin:isAdmin,
    isValidCustomerOrAdmin,

}
module.exports = authJwt;