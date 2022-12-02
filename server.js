const { response } = require('express');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const middleware = require('./middleware/auth');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const path = require('path')
    //import models
const Item = require("./models/Item")
const Customer = require("./models/Customer")

//db connection config
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: "true",
})
mongoose.connection.on("error", err => {
    console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
    console.log("database is connected")
})
console.log(path.join(__dirname, '/assets/'));
app.use(express.static(path.join(__dirname, '/assets/')));

app.use(express.static(path.join(__dirname, '/views/partials/')))
app.set('view engine', "ejs");
app.get("/", (req, res) => {
    res.render('home.ejs', {
        username: "Hritul"
    })
})
app.get("/profile", async(req, res) => {
    const products = await Item.find({});
    res.render('profile.ejs', { products: products })
})
app.get("/login", (req, res) => {
    res.render('login.ejs')
})
app.get("/createAccount", (req, res) => {
    res.render('createAccount.ejs')
})
app.get("/addProduct", (req, res) => {
    res.render('addProduct.ejs')
})
app.get('/addtoCart', (req, res) => {
    res.sendStatus(200);
})
app.post("/loginhandler", async(req, res) => {
    console.log(req.body);
    res.redirect("/profile");
})
app.get("/viewcart", (req, res) => {
        res.render('viewcart.ejs');
    })
    //adding item
app.post("/additem", async(req, res) => {
        const data = req.body;
        console.log(data);
        try {
            const newItem = new Item({ name: data.name, weight: data.weight, price: data.cost, desc: data.desc });
            await newItem.save();
            console.log("inserted successfully");
            res.sendStatus(200);
        } catch (err) {
            console.log(err)
            res.send("Error in adding item");
        }
    })
    //fetch product 
    //add to cart
app.post("/createAccounthandler", async(req, res) => {
        const data = req.body;
        console.log(data);
        try {
            const newCustomer = new Customer({ firstname: data.firstname, lastname: data.lastname, username: data.username, email: data.email, password: data.password, Contact: data.Contact, address: data.address, address2: data.address2, city: data.city, state: data.state, zip: data.zip });
            await newCustomer.save();
            console.log("Customer added sucessfully");
            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.send("Error in adding Customer");
        }
    })
    //get all items
app.get("/getItems", async(req, res) => {
    try {
        const items = await Item.find({});
        res.send(items);
    } catch (err) {
        console.log(err);
        res.sendStatus(401);
    }
})
app.get("/getCustomer", async(req, res) => {
    try {
        const customer = await Customer.find({});
        res.send(customer);
    } catch (err) {
        console.log(err);
        res.sendStatus(401);
    }
})
app.post("/createAccounthandler", (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
})
app.post("/additem", (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
})
app.listen(4500);
console.log("app is running at port 4500")