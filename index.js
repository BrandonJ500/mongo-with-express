const express = require("express");
const app = express();
const path = require("path");
const Product = require("./models/product")
const methodOverride = require('method-override')
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
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"));

app.get("/products", async (req,res)=>{
    const products = await Product.find({})
    res.render("products/index", {products})
})
app.get("/products/new", (req,res)=>{
    res.render("products/new")
})


app.post("/products", async (req,res)=>{
    const newProduct = new Product(req.body)
    await newProduct.save();
    res.redirect("/products")
})

app.get("/products/:id", async (req,res)=>{
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render("products/show",{product})
})

app.get("/products/:id/edit", async (req,res)=>{
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render("products/edit", {product})
})

app.put("/products/:id", async (req,res)=>{
    const {id} = req.params
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new:true});
    res.redirect(`/products/${product._id}`)
})


app.listen(3000,()=>{
    console.log("listening on port 3000");
})