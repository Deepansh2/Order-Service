const mongoose = require("mongoose")
const constants = require("../utils/constant")

const orderSchema = new mongoose.Schema({

    customerId : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : "user"
    },
    deliveryDate : {
        type : Date,
        default : ()=>{
            return Date.now()
        }
    },
    status : {
        type : String,
        required : true,
        default : constants.orderStatus.success,
        enum : [constants.orderStatus.success,constants.orderStatus.inprogress,constants.orderStatus.cancelled]
    },
    items : {
        type : [String],
        required : true
    },
    totalCost : {
        type : Number,
        required : true
    },
    address : {
        type : String,
        required: true
    }

},{timestamps : true,versionKey : false});

module.exports = mongoose.model("order",orderSchema)