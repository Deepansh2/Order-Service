const express = require("express");
const app = express();
const serverConfig = require("./configs/server.config")


const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}))


const dbConfig = require("./configs/db.config");
const mongoose = require("mongoose");
mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;
db.on("Error",()=>{
    console.log("Error while initialization of db",err.message)
});
db.once("open",()=>{
    console.log("mongodb is connected")
    init();
})



const User = require("./models/user.model")
const bcrypt = require("bcryptjs")
async function init(){

    try{
    await User.collection.drop();
    
    const user =  await User.create({
        name : "deepanshu",
        userId : "admin",
        email : "deepanshusing54@gmail.com",
        password : bcrypt.hashSync("deepanshu",8),
        userType : "ADMIN"
    })
    console.log(user)
}catch(err){
    console.log("Error in db initialization",err.message)
}

}


app.listen(serverConfig.PORT, ()=>{

    console.log("Server started at port number :",serverConfig.PORT)
})
