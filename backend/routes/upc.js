const express = require('express');
const { 
    getProductInformation
} = require('../controllers/productController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Require authentication for all product routes
router.use(requireAuth);

// GET all product information
router.get('/:upc', getProductInformation);

module.exports = router;