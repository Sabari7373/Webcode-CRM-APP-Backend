


const mongoose = require("mongoose");
const mongoURL = "mongodb+srv://sabariganesh7373:sabariganesh7373@cluster0.8dkwxcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURL , { useNewUrlParser:true , useUnifiedTopology:true });

const connection = mongoose.connection

connection.on("error", ()=>{
    console.log("Mongo DB connection failed !!!!!!");
})
connection.on("connected" , ()=>{
    console.log("Mongo DB connection Successfull !!!!!!");
})

module.exports = mongoose;