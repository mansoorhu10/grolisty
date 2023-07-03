const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const grocerySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('GroceryItem', grocerySchema);
