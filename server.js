const { response } = require('express');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const path = require('path')
    //import models
const Item = require("./models/Item")

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
// const path = require('path')

app.use(express.static(path.join(__dirname, '/views/partials/')))
app.set('view engine', "ejs");
app.get("/", (req, res) => {
    res.render('home.ejs', {
        username: "Hritul"
    })
})
app.get("/profile", (req, res) => {
    res.render('profile.ejs')
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
app.post("/loginhandler", (req, res) => {
        console.log(req.body);
        res.redirect("/profile");
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

app.get("/temp", async(req, res) => {
    const newItem = new Item({
        name: "Bangle",
        weight: "10",
        price: 52732,
        desc: "Bangle"
    })
    await newItem.save();
    res.send(200);

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