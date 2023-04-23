const express = require("express");
const app = express();
const path = require("path");
const Product = require("./models/product")
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const AppError = require("./AppError");

mongoose.connect('mongodb://127.0.0.1:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("connected")
    })
    .catch(err => {
        console.log("Error", err)
    })





const categories = ["fruits", "vegetable", "dairy"];


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));

app.get("/products", async (req, res, next) => {
    try{
          const { category } = req.query;
    if (category) {
        const products = await Product.find({ category })

        res.render("products/index", { products, category })
    } else {
        const products = await Product.find({})

        res.render("products/index", { products, category: "All" })
    }  
    }catch (e){
       next(e);
    }

})

app.get("/products/new", (req, res) => {
    res.render("products/new", { categories })
})

app.post("/products", async (req, res, next) => {
    try {
        const newProduct = new Product(req.body)
        await newProduct.save();
        res.redirect("/products")
    }
    catch (e) {
        next(new AppError("Something went wrong"), 404)
    }

})

app.get("/products/:id", async (req, res, next) => {
    try {
           const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        throw new AppError("Product Not Found", 404)
    }
    res.render("products/show", { product }) 
    }catch(e){
        next(e);
    }

})

app.get("/products/:id/edit", async (req, res, next) => {
    try {
            const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        throw new AppError("Product Not Found", 404)
    }
    res.render("products/edit", { product, categories })
    } catch (e){
        next(e)
    }

})

app.put("/products/:id", async (req, res, next) => {
    try {
        const { id } = req.params
        const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
        res.redirect(`/products/${product._id}`)
    } catch (e) {
        next(e)
    }

})

app.delete("/products/:id", async (req, res) => {
    const { id } = req.params;
    console.log(req.params)
    const productDelete = await Product.findByIdAndDelete(id);
    productDelete;
    res.redirect("/products")
})

app.use((err, req, res, next) => {
    const { status = 500, message = "something went wrong" } = err;

    res.status(status).send(message);
})

app.listen(3000, () => {
    console.log("listening on port 3000");
})