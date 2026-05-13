const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', categoryController.getCategories);
router.post('/', protect, adminOnly, categoryController.createCategory);

module.exports = router;
