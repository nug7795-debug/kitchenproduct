const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', productController.getProducts);
router.get('/:slug', productController.getProductBySlug);
router.post('/', protect, adminOnly, productController.createProduct);

module.exports = router;
