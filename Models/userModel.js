const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true // No duplication
        },
        password: {
            type: String,
            required: function() {
                return !this.googleId; // Only if googleID is not present
            }
        },
        googleId: {
            type: String,
            required: false 
        }
    },
    {collection: 'Users'}
);

module.exports = mongoose.model("User", userSchema)