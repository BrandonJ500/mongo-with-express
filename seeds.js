const mongoose = require('mongoose');
const Product = require("./models/product")


mongoose.connect('mongodb://127.0.0.1:27017/farmStand', {useNewUrlParser: true,useUnifiedTopology: true })
.then(()=>{
    console.log("connected")
})
.catch(err=>{
    console.log("Error", err)
})


const p = new Product({
    name: "Ruby Grapefruit",
    price: 1.99,
    category: "fruit"
})

p.save().then(p=>{
    console.log(p)
})
.catch(e=>console.log(e))