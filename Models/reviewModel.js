const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
    {
        user: {
            type: String,
            required: true,
        },
        finishedReading: {
            type: Boolean,
            required: true
        },
        reviewContent: {
            type: String
        },
        book: {
            title: {type: String, required: true},
            author: {type: String, required: true},
            publishedYear: {type: String, required: true},
            genre: {type: String, required: true},
            thumbnail: {type: String, required: true}
        },
        tags: {
            type: [String],
            required: true
        },
        rating: {
            type: Number,
            required: true
        }
    },
    {collection: 'reviews-metadata'}
);

module.exports = mongoose.model("Reviews", reviewSchema)