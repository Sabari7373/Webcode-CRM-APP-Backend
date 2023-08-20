
const express = require("express");
const app = express();
const cors = require('cors');
const db = require('./config/db')

app.use(cors());
app.use(express.json());


const port = process.env.PORT || 3001
app.listen(port, () => console.log("Node server started using nodemon in 3001"));
