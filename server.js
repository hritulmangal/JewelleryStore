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
const Customer = require("./models/Customer");
const { getMaxListeners } = require('process');

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
    // console.log(path.join(__dirname, '/assets/'));
app.use(express.static(path.join(__dirname, '/assets/')));

app.use(express.static(path.join(__dirname, '/views/partials/')))
app.set('view engine', "ejs");
app.get("/", (req, res) => {
    res.render('first.ejs', {
        username: "Hritul"
    })
})
app.get("/home", async(req, res) => {
    const products = await Item.find({});
    console.log(products);
    res.render('home.ejs', { products: products })
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
app.get('/addtoCart', async(req, res) => {
    try {
        const id = req.query.id;
        // customer m fine krna h prev cart or check krna h ki id already present or not balbla
        await Customer.updateOne({ email: "mangalhritul@gmail.com" }, { $push: { cart: { pid: id, quan: 1 } } });
        // res.sendStatus(200);
        res.redirect('/viewcart')
    } catch (err) {
        console.log(err);
        res.sendStatus(401);
    }
})

//delete from cart
app.get('/removefromCart', async(req, res) => {
    try {
        const id = req.query.id;
        // customer m fine krna h prev cart or check krna h ki id already present or not balbla
        await Customer.updateOne({ email: "mangalhritul@gmail.com" }, { $pull: { cart: { pid: id, quan: 1 } } });
        // res.sendStatus(200);
        res.render("/viewcart");
    } catch (err) {
        console.log(err);
        res.sendStatus(401);
    }
})

app.post("/loginhandler", async(req, res) => {
    // console.log(req.body);
    res.redirect("/home");
})
app.get("/viewcart", async(req, res) => {
    const itemIDs = (await Customer.find({ email: "mangalhritul@gmail.com" }))[0].cart;
    // console.log(itemIDs);
    const items = [];
    for (var i = 0; i < itemIDs.length; i++) {
        let itemID = itemIDs[i].pid;
        items.push((await Item.find({ _id: itemID }))[0]);
    }
    res.render('viewcart.ejs', { items: items });
})
app.get("/CustomerProfile", async(req, res) => {
    const customers = (await Customer.find({ email: "mangalhritul@gmail.com" }));
    // console.log(customers);
    const customer = [];
    for (var i = 0; i < customers.length; i++) {
        let cid = customers[i]._id;
        customer.push((await Customer.find({ _id: cid }))[0]);
    }
    res.render('cprofile.ejs', { customer: customer });
})
app.get("/orderstatus", (req, res) => {
    res.render('orderstatus.ejs');
})
app.get("/order", (req, res) => {
    res.render('order.ejs', { items: [{ orderDate: "12 july 2022", amount: 528, address: "oat mnit jaipur" }] });
})
app.get("/query", (req, res) => {
    res.render('query.ejs');
})
app.get("/customerProfile", (req, res) => {
        res.render('cprofile.ejs');
    })
    //adding item;lm
app.get("/addorder", async(req, res) => {
    const prevData = (await Customer.findOne({ email: "mangalhritul@gmail.com" }));
    // console.log(prevData)
    const availableCart = [];
    for (var i = 0; i < prevData.cart.length; i++) {
        availableCart.push(prevData.cart[i]);
    }
    console.log("hehe", availableCart);
    var subtotal = 0;
    for (var i = 0; i < availableCart.length; i++) {
        let pid = availableCart[i].pid;
        const price = (await Item.find({ pid: pid }))[0].price;
        subtotal += price;
    }
    const address = prevData.address;
    const mobile = prevData.Contact;

    const data = await Customer.updateOne({ email: "mangalhritul@gmail.com" }, { $push: { orders: { orderDate: Date.now(), amount: subtotal, address: address, mobile: mobile } } })
    res.sendStatus(200);
})
app.post("/additem", async(req, res) => {
        const data = req.body;
        // console.log(data);
        try {
            const newItem = new Item({ name: data.name, weight: data.weight, price: data.cost, desc: data.desc, image: data.image });
            await newItem.save();
            console.log("inserted successfully");
            // res.sendStatus(200);
            res.redirect("/home");
        } catch (err) {
            console.log(err)
            res.send("Error in adding item");
        }
    })
    //fetch product 
    //add to cart
app.post("/createAccounthandler", async(req, res) => {
        const data = req.body;
        // console.log(data);
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
    // console.log(req.body);
    res.sendStatus(200);
})
app.listen(4500);
console.log("app is running at port 4500")