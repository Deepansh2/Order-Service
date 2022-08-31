const User = require("../models/user.model");
const constants = reqiure("../utils/constant");
const bcrypt = require("bcryptjs")
const jwt  = require("jsonwebtoken")
const authConfig = require("../configs/auth.config")

exports.signup = async (req,res) =>{

    if(req.body.userType != constants.userTypes.customer){
        req.body.userStatus = constants.userStatus.pending
    }

    const userObj = {
        name : req.body.name,
        userId: req.body.userId,
        email : req.body.email,
        password : bcrypt.hashSync(req.body.password,8),
        userType : req.body.userType,
        userStatus : req.body.userStatus
    }

    try{
    const userCreated = User.create(userObj);

    const response = {
        name : userCreated.name,
        userId : userCreated.userId,
        email : userCreated.email,
        userType : userCreated.userType,
        userStatus : userCreated.userStatus,
        createdAt : userCreated.createdAt,
        updatedAt : userCreated.updatedAt
    }
    res.status(201).send(response);
}catch(err){
    console.log("Some error happened while signup",err.message);
    res.status(500).send({
        message : "Some internal server error"
    })
}
}

exports.signin = (req,res) =>{


    try{
    const user = User.findOne({userId : req.body.userId});

    if(user == null){
        res.status(400).send({
            message : "Failed ! userId passed doesn't exist"
        })
    }
    if(user.userStatus == constants.userStatus.pending){
        res.status(400).send({
            message : "Not yet APPROVED by ADMIN"
        })
    }
    const isPasswordValid = bcrypt.compareSync(req.body.password,user.password);
    if(!isPasswordValid){
        res.status(401).send({
            message : "Unthorized ! wrong password"
        })
    }

    const token = jwt.sign({
        id : user.userId
    },authConfig.secret,{
        expiresIn:600
    });

    res.status(200).send({
        name : user.name,
        userId : user.userId,
        email:user.email,
        userStatus : user.userStatus,
        userType : user.userType,
        accessToken : token
    })

}catch(err){
    console.log("Some error happened in signin",err.message);
    res.status(500).send({
        message : "Some internal server error"
    })
}
}