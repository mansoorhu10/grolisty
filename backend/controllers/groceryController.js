const { default: mongoose } = require('mongoose');
const Grocery = require('../models/groceryModel');

// get all groceries
const getAllGroceries = async (request, response) => {
    const userId = request.userId;
    const groceries = await Grocery.find({ userId }).sort({createdAt: -1});
    response.status(200).json(groceries);
}

// get a single grocery item
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

// create a new grocery item
const createGroceryItem = async (request, response) => {
    const {title, brand, weight} = request.body;

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
        const userId = request.userId
        const groceryItem = await Grocery.create({title, brand, weight, userId});
        response.status(200).json(groceryItem); // indicates OK
    } catch (error) {
        response.status(404).json({error: error.message}); // indicates error
    }
}

// delete a grocery item
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


// update a grocery item
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