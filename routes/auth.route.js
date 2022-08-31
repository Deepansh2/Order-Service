const authController = require("../controllers/auth.controller")
const {verifySignUp} = require("../middlewares")

module.exports = (app) =>{

    app.post("/orderservice/api/v1/signup",[verifySignUp.verifySignUpReqBody],authController.signup)

    app.post("/orderservice/api/v1/signin",[verifySignUp.verifySignInReqBody],authController.signin)
}