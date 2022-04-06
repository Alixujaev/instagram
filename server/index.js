const express = require("express");
const app = express();
const path = require("path")
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const { MONGO_URI } = require("./config");
const bodyParser = require('body-parser')

mongoose.connect(MONGO_URI)
require("./models/user")
require("./models/post")

const cors=require("cors");


const corsOptions ={
   origin:'*', 
   credentials:true,           
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration



app.use(express.json());
app.use(require("./routes/auth"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))
app.use(bodyParser.json());

if(process.env.NODE_ENV === "production"){
  app.use(express.static("client/build"))
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}


app.listen(PORT, () => {
  console.log("Server has been started");
})