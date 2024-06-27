const express = require("express");
const app = express();
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const dotenv = require("dotenv").config();
const URL = "mongodb+srv://sabariganesh7373:sabariganesh7373@cluster0.8dkwxcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
require('./config/db')
require('dotenv')
const jwt = require("jsonwebtoken");

const leadsRoute = require('./routes/leadsRoute')// for leads
const cors = require('cors');
const corsOptions ={
    origin:'https://webcode-crm-app-front-end.vercel.app//', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
// Middleweare
app.use(express.json());

app.use("api/leads" , leadsRoute) // for leads


app.get('/', (req, res) => {
  res.send('hello world')
});

// For LogIn
// app.post("/login", async function (req, res) {
//   try {
//     const connection = await mongoClient.connect(URL);

//     const db = connection.db("blog");
    
//     const user = await db.collection("users").findOne({ email: req.body.email });
//     if (user) {
//       res.status(200).json({
//         message: "Successfully Logged In",
//       });
//     } else {
//       res.status(401).json({
//         message: "User not found",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

app.post("/login", async (req, res) => {
  const { email } = req.body;
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("blog");
    const user = await db.collection("users").findOne({ email: req.body.email });
  
    if (user) {
      const token = jwt.sign({id:user._id}, process.env.SECRETKEY);

      res.send({message : "Successful", token:token,user:user.firstName});
    } else {
      return res.status(400).json({ message: "Login failed" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/service", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);

    const db = connection.db("blog");
    let student = await db.collection("users").find().toArray();

    await connection.close();
    res.send(student);
  } catch (error) {
    console.log(error);
  }
});

app.post("/signup", async function(req, res) {
   try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("blog");
   
    console.log(req.body);
    await db.collection("users").insertOne(req.body);
    await connection.close();
    res.json({
      message: "Successfully Registered",
    });
  } catch (error) {
    
    res.status(500).json({
      message: "something error",
    });
  }
});


// Create a lead 
app.post("/servicereq", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("blog");
    await db.collection("serviceRequest").insertOne(req.body);
   
    await connection.close();
    res.json({
      message: "Successfully Request",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
    });
  }
});

// to delete the lead in database
app.delete('/servicereq/:id', async function (req , res){
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("blog");
    const deleteLead  = await db.collection("serviceRequest").findOneAndDelete({_id:new mongodb.ObjectId(req.params.id)})  
    await connection.close()
    res.status(200).json(deleteLead)
  } catch (error) {
    res.status(500).json({
      message: "Error",
    });
  }
})

// for edit purpose here we use this API
// so the purticular data has been displayen in edit form
app.get("/viewSingleRequest/:id" , async function (req , res) {
  try{
    const connection = await mongodb.MongoClient.connect(URL);
    const db = connection.db("blog")
    const listOfRequests = await db.collection("serviceRequest").findOne({_id:new mongodb.ObjectId(req.params.id)})
    await connection.close()
    res.status(200).json(listOfRequests)
  }
  catch (error) {
    res.status(400).json({error:error.message})
  }
})

// view all the service sequests from database
app.get("/viewServiceRequests" , async function (req , res) {
  try{
    const connection = await mongodb.MongoClient.connect(URL);
    const db = connection.db("blog")
    const listOfRequests = await db.collection("serviceRequest").find().toArray()
    await connection.close()
    res.status(200).json(listOfRequests)
  }
  catch (error) {
    res.status(400).json({error:error.message})

  }
})
// app.put('/editleads/:id', async function(req , res){
//   const ids = req.params.id;
//   // const findTheLead = ids.
// })
app.put('/editleads/:id', async function (req,res){
  try {
    const connection = await mongodb.MongoClient.connect(URL);
    const db = connection.db("blog")
    const EditLead = await db.collection("serviceRequest").updateOne({_id:new mongodb.ObjectId(req.params.id)},
    {$set:req.body}) 
    res.status(200).send(EditLead)
    await connection.close()
  } catch (error) {
    res.status(400).json({error:error.message})
  }
})

app.get("/register/:id", async function (req, res) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("blog");
    let student = await db
      .collection("users")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });
    await connection.close();
    res.json(student);
  } catch (error) {
    console.log(error);
  }
});

app.get('/editleads/:id', async (req,res)=>{
  try{
    const connection = await mongoClient.connect(URL);
    const db = connection.db("blog");
    let lead = await db
      .collection("serviceRequet")
      .findOne({ _id: mongodb.ObjectId(req.params.id) });
    await connection.close();
    res.json(lead);
  }
  catch (error) {
    console.log(error);
  }
})


app.post('/createadminregister',async function(req,res){
  try{
      const connection = await mongoClient.connect(URL);
      const db = connection.db('blog');
      console.log(req.body);
      await db.collection("admins").insertOne(req.body);
      await connection.close();
      res.json({
        message: "Successfully Registered",
      });
  } catch (error) {
      console.log(error)
      res.status(500).json({message:"something went wrong"});
  }
})

//Admin login
// app.post("/login", async (req, res) => {
//   const { email } = req.body;
//   try {
//     const connection = await mongoClient.connect(URL);
//     const db = connection.db("blog");
//     const user = await db.collection("users").findOne({ email: req.body.email });
  
//     if (user) {
//       const token = jwt.sign({id:user._id}, process.env.SECRETKEY);
//       res.send({message : "Successful", token:token,user:user.firstName});
//     } else {
//       return res.status(400).json({ message: "Login failed" });
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });
app.post('/adminlogin',async (req,res)=>{
  const { email } = req.body;
  try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db('blog');
      const isAdmin = await db.collection('admins').findOne({ email: req.body.email });
      if (isAdmin) {
          res.send({message : "Successful", user:isAdmin.firstName});
      } else {
          console.log(error)
          res.status(401).json({message:"Enter correct Email"})
      }
      await connection.close();
  } catch (error) {
      console.log(error)
      res.status(500).json({message:"Something Went Wrong"})
  }
})



app.listen(3001 , ()=>{
  console.log(" server running on port  3001");
});