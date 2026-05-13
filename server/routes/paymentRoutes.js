const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// In a real app, add auth middleware here
router.post('/create-intent', paymentController.createPaymentIntent);
router.post('/submit-utr', paymentController.submitUtr);
router.get('/status/:transactionId', paymentController.getPaymentStatus);

module.exports = router;
