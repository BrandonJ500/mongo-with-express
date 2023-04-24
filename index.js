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





const categories = ["fruit", "vegetable", "dairy"];


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));

function wrapAsync(fn){
    return function(req,res, next){
        fn(req,res,next).catch(e=>next(e));
    }
}


app.get("/products", wrapAsync( async (req, res, next) => {
        const { category } = req.query;
        if (category) {
            const products = await Product.find({ category })

            res.render("products/index", { products, category })
        } else {
            const products = await Product.find({})

            res.render("products/index", { products, category: "All" })
        }
}))

app.get("/products/new", (req, res) => {
    res.render("products/new", { categories })
})

app.post("/products", wrapAsync(async (req, res, next) => {

        const newProduct = new Product(req.body)
        await newProduct.save();
        res.redirect("/products")
}))


app.get("/products/:id", wrapAsync( async (req, res, next) => {

    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        throw new AppError("Product Not Found", 404)
    }
    res.render("products/show", { product })
}))

app.get("/products/:id/edit", wrapAsync(async (req, res, next) => {
 
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            throw new AppError("Product Not Found", 404)
        }
        res.render("products/edit", { product, categories })
}))

app.put("/products/:id", wrapAsync(async (req, res, next) => {
        const { id } = req.params
        const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
        res.redirect(`/products/${product._id}`)

}))

app.delete("/products/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    console.log(req.params)
    const productDelete = await Product.findByIdAndDelete(id);
    productDelete;
    res.redirect("/products")
}))

const handleValidationError = err => {
    console.dir(err);
    return err;
}

app.use((err, req, res, next) => {
   if(err.name === "ValidationError") err = handleValidationError(err);
    next(err)
})

app.use((err, req, res, next) => {
    const { status = 500, message = "something went wrong" } = err;
    res.status(status).send(message);
})

app.listen(3000, () => {
    console.log("listening on port 3000");
})