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

router.get('/getReviews', async(req, res) => {
    const params = {
        Bucket: 'bookvibe-bucket'
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        const filePromises = data.Contents.map(async (file) => {
            const fileParams = { Bucket: 'bookvibe-bucket', Key: file.Key };
            const fileData = await s3.getObject(fileParams).promise();
            return JSON.parse(fileData.Body.toString('utf-8'));
        });

        const reviews = await Promise.all(filePromises);
        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews; ", error);
        console.log(error);
        res.status(500).json({message: "Error getching reviews" ,error});
    }
});

module.exports = router;