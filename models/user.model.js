const mongoose  = require('mongoose');
const constants = require('../utils/constant');

const userSchema = new mongoose.Schema({

    name : {
        type : String,
        required : true
    },
    userId : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true 
    },
    email : {
        type : String,
        required : true,
        lowercase : true,
        minLength : 10,
        unique : true
    },
    ordersPlaced :{
        type : [mongoose.SchemaTypes.ObjectId],
        ref : 'order'
    },
    userType : {
        type : String,
        required : true,
        default : constants.userTypes.customer,
        enum : [constants.userTypes.customer,constants.userTypes.admin]
    },
    userStatus : {
        type : String,
        required : true,
        default : constants.userStatus.approved,
        enum : [constants.userStatus.approved,constants.userStatus.pending,constants.userStatus.rejected]
    }

},{timestamps:true,versionKey : false});

module.exports = mongoose.model("user", userSchema);