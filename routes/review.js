const express = require('express');
const router = express.Router();

const reviewController = require('../controller/review_controller');

router.post('/setReview/:id', reviewController.setReview);
module.exports = router;