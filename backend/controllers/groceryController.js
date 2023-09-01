const Grocery = require('../models/groceryModel');
const mongoose = require('mongoose');

// Get all groceries
const getAllGroceries = async (request, response) => {
    const user_id = request.user._id;

    const groceries = await Grocery.find({user_id}).sort({createdAt: -1});

    response.status(200).json(groceries);
}

// Get a single grocery item
const getGroceryItem = async (request, response) => {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return response.status(404).json({error: 'No such grocery item'});
    }

    const groceryItem = await Grocery.findById(id);

    if(!groceryItem) {
        return response.status(404).json({error: 'No such grocery item'});
    }
    response.status(200).json(groceryItem);
}

// Create a new grocery item
const createGroceryItem = async (request, response) => {
    const {title, brand, weight, weightUnit} = request.body;

    let emptyFields = [];

    if(!title) {
        emptyFields.push('title');
    }
    if(!brand) {
        emptyFields.push('brand');
    }
    if(!weight) {
        emptyFields.push('weight');
    }

    if(emptyFields.length > 0){
        return response.status(400).json({ error: 'Please fill in all the fields', emptyFields });
    }

    // Add the document to the database
    try {
        const user_id = request.user._id;
        const groceryItem = await Grocery.create({title, brand, weight, weightUnit, user_id});
        response.status(200).json(groceryItem); // indicates OK
    } catch (error) {
        response.status(404).json({error: error.message}); // indicates error
    }
}

// Delete a grocery item
const deleteGroceryItem = async (request, response) => {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return response.status(404).json({error: 'No such grocery item'});
    }
    
    const groceryItem = await Grocery.findOneAndDelete({_id: id});

    if(!groceryItem){
        return response.status(404).json({error: 'No such grocery item'});
    }

    response.status(200).json(groceryItem);
} 


// Update a grocery item
const updateGroceryItem = async (request, response) => {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return response.status(404).json({error: 'No such grocery item'});
    }

    const groceryItem = await Grocery.findOneAndUpdate({_id: id}, {
        ...request.body
    });

    if (!groceryItem){
        return response.status(404).json({error: 'No such grocery item'});
    }

    return response.status(200).json(groceryItem);
}

module.exports = {
    createGroceryItem,
    getAllGroceries,
    getGroceryItem,
    deleteGroceryItem,
    updateGroceryItem
}