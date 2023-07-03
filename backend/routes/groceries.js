const express = require('express');
const { 
    createGroceryItem,
    getAllGroceries,
    getGroceryItem,
    deleteGroceryItem,
    updateGroceryItem
} = require('../controllers/groceryController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Require authentication for all grocery routes
router.use(requireAuth);

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