const express = require("express");
const app = express();
const path = require("path");
const Product = require("./models/product")

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/farmStand', {useNewUrlParser: true,useUnifiedTopology: true })
.then(()=>{
    console.log("connected")
})
.catch(err=>{
    console.log("Error", err)
})








app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/dog",(req,res)=>{
    res.send("WOOF!")
})



app.listen(3000,()=>{
    console.log("listening on port 3000");
})