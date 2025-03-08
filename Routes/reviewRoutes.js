const express = require('express');
const router = express.Router();
const Review = require('../Models/reviewModel');
const s3 = require('../public/js/awsConfig')

// Save the review
router.post('/saveReview', async (req, res) => {

    const fileName = `reviews/${Date.now()}-review.json`;
    
    try {
        const newReview = new Review(req.body)

        const params = {
            Bucket: 'bookvibe-bucket',
            Key: fileName,
            Body: JSON.stringify(newReview, null, 2),
            ContentType: 'application/json'
        };

        await newReview.save();
        await s3.upload(params).promise();
        res.status(201).json({message: 'Review saved successfully', review: newReview});

    } catch (error) {
        console.error("Error saving review:", error);
        res.status(500).json({message: 'Error saving review', error});
    }
});

module.exports = router;