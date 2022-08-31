const Order = require("../models/order.model");
const User = require("../models/user.model");
const constants = require("../utils/constant")




exports.createOrder = async (req,res) =>{

    const user = await User.findOne({userId:req.userId})
    const orderObj = {
        customerId : user._id,
        deliveryDate : req.body.deliveryDate,
        items : req.body.items,
        status : req.body.status,
        totalCost : req.body.totalCost,
        address: req.body.address
    }

    try{
    const order = await Order.create(orderObj);

    user.ordersPlaced.push(order._id)

    await user.save()

    return res.status(201).send(order)
    }catch(err){
        console.log("Erro while creating the orders");
        return res.status(500).send({
            message : "Some Internal server error"
        })
    }

}

exports.getAllOrders = async (req,res) =>{

    try{
    const user = await User.findOne({userId:req.userId})
    const queryObj = {};

    if(user.userType == constants.userTypes.customer){
        queryObj.customerId = user._id
    }
    const orders = await Order.find(queryObj);
    res.status(200).send(orders);
}catch(err){
    console.log("Error while getting all orders",err.message);
    return res.status(500).send({
        message : "Some Internal server error"
    })
}
};

exports.getOneOrder = async (req,res) =>{

    try{
    const order = await Order.fineOne({_id:req.params.id});
    return res.status(200).send(order);
    }catch(err){
        console.log("Error while getting one order",err.message);
        return res.status(500).send({
            message : "Some Internal server error"
        })
    }
}

exports.updateOrder = async (req,res) =>{

    
    try{
    const user = await User.findOne({userId:req.userId})

    const order = await Order.findOne({_id:req.params.id});
    if(order == null){
        return res.status(400).send({
            message : "Order doesn't exist"
        })
    }

    order.deliveryDate = req.body.deliveryDate != undefined ? req.body.deliveryDate : order.deliveryDate;
    order.items = req.body.items != undefined ? req.body.items : order.items;
    order.status = req.body.status != undefined ? req.body.status : order.status;
    order.totalCost = req.body.totalCost != undefined ? req.body.totalCost : order.totalCost;
    order.address = req.body.address != undefined ? req.body.address : order.address;

    const queryObj = {};
    if(user.userType == constants.userTypes.admin){
        queryObj.customerId = user._id
    }
    order.totalCost = req.body.totalCost != undefined ? req.body.totalCost : order.totalCost;
    const updatedOrder = await order.save();

    res.status(200).send(updatedOrder);

}catch(err){
    console.log("Error while updating order",err.message);
    return res.status(500).send({
        message: "Some Internal server error"
    })
}
}

exports.cancelOrder = (req,res) =>{


    try{
    const order  = await Order.fineOne({_id:req.params.id});

    if(order == null){
        return res.status(400).send({
            message : "order doesn't exist"
        })
    }

    order.status = constants.orderStatus.cancelled
    await order.save();
    return res.status(200).send({
        message : "Successfully cancelled"
    })
}catch(err){
    console.log("Error while cancelling order",err.message);
    return res.status(500).send({
        message: "Some Internal server Error"
    })
}
}