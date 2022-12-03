const mongoose = require('mongoose')
const { Schema } = mongoose;

const CustomerSchema = new Schema({
    firstname: String,
    lastname: String,
    username: { type: String, unique: true },
    email: String,
    password: String,
    Contact: Number,
    address: String,
    address2: String,
    city: String,
    state: String,
    zip: Number,
    cart: [{ pid: String, quan: Number }],
    orders: [{ products: [String], orderDate: Date, amount: Number, address: String, mobile: String }]
        // fileName: type
});

module.exports = mongoose.model("Customer", CustomerSchema);