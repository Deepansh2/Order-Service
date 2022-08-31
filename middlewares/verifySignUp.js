const User = require("../models/user.model")
const constants = require("../utils/constant")

const verifySignUpReqBody = (req,res,next) =>{

    try{
    if(!req.body.name){
        return res.status(400).send({
            message : "Failed ! name is not provided"
        })
    }
    if(!req.body.userId){
        return res.status(400).send({
            message : "Failed ! userId is not provided"
        })
    }

    const user = await User.findOne({userId:req.body.userId});
    if(user != null){
        return res.status(400).send({
            message: "Failed ! userId is already present"
        })
    }

}catch(err){
    return res.status(500).send({
        message: "Internal server error while validating the signin request"
    })
}
    if(!req.body.password){
        return res.status(400).send({
            message : "Failed ! password is not provided"
        })
    }
    if(!req.body.email){
        return res.status(400).send({
            message : "Failed ! email Id is not provided"
        })
    }
    if(!isValidEmail(req.body.email)){
        return res.status(400).send({
            message :"Failed ! email Id is not valid"
        })
    }
    if(req.body.userType == constants.userTypes.admin){
        return res.status(400).send({
            message: "Admin registration is not allowed"
        })
    }

    const userTypes = [constants.userTypes.hr,constants.userTypes.student]
    if(!userTypes.includes(req.body.userType)){
        return res.status(400).send({
            message : "Failed ! userType provided is not correct. Possible correct valules : HR | STUDENT"
        })
    }

    next();

}

const isValidEmail = (email) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}

const verifySignInReqBody = (req,res,next) =>{

    if(!req.body.userId){
        res.status(400).send({
            message: "Failed ! userId is not present"
        })
    }
    if(!req.body.password){
        res.status(400).send({
            message : "Failed ! Password is not provided"
        })
    }
    next();
}
const verifyRequestBodiesForAuth = {
    verifySignUpReqBody : verifySignUpReqBody,
    verifySignInReqBody : verifySignInReqBody
}

module.exports = verifyRequestBodiesForAuth