const orderController = require("../controllers/order.controller");
const {authJwt} = require("../middlewares")

module.exports = (app) =>{

    //CREATE CALL
    app.post("/orderservice/api/v1/order",[authJwt.verifyToken],orderController.createOrder);

    //GET ALL THE ORDERS
    app.get("/orderservice/api/v1/orders",[authJwt.verifyToken,authJwt.isValidCustomerOrAdmin],orderController.getAllOrders);

    //GET SINGLE ORDER
    app.get("/orderservice/api/v1/order/:id",[authJwt.verifyToken,authJwt.isValidCustomerOrAdmin],orderController.getOneOrder);

    //UPDATE CALL
    app.put("/orderservice/api/v1/orders/:id",[authJwt.verifyToken,authJwt.isValidCustomerOrAdmin].orderController.updateOrder);
    
    //DELETE CALL
    app.delete("/orderservice/api/v1/orders/:id",[authJwt.verifyToken,authJwt.isValidCustomerOrAdmin],orderController.cancelOrder)
}