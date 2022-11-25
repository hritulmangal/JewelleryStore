const mongoose = require('mongoose')
const { Schema } = mongoose;

const ItemSchema = new Schema({
    name: String,
    price: Number,
    weight: String,
    image: String,
    desc: String
});

module.exports = mongoose.model("Item", ItemSchema);