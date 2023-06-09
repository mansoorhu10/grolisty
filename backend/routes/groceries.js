const express = require('express');
const router = express.Router();
const Grocery = require('../models/groceryModel');
const { 
    createGroceryItem,
    getAllGroceries,
    getGroceryItem,
    deleteGroceryItem,
    updateGroceryItem
} = require('../controllers/groceryController');

// GET all groceries
router.get('/', getAllGroceries);

// GET a single grocery item
router.get('/:id', getGroceryItem);

// POST a new grocery item
router.post('/', createGroceryItem);

// DELETE a grocery item
router.delete('/:id', deleteGroceryItem);

// UPDATE a grocery item
router.patch('/:id', updateGroceryItem);


module.exports = router;