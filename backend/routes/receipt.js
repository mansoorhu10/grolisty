const express = require('express');
const { 
    getProductInformation
} = require('../controllers/productController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Require authentication for all product routes
router.use(requireAuth);

// POST upcs to get all product information
router.post('/', getProductInformation);

module.exports = router;