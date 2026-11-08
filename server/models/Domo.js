const mongoose = require('mongoose');
const _ = require('underscore');

// Function to clean up the name (trim spaces, escape HTML characters for security)
const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    age: {
        type: Number,
        min: 0,
        required: true,
    },
    owner: {
        // Stores the ID of the Account that made this
        type: mongoose.Schema.ObjectId, 
        required: true,
        // Tells Mongoose this links to the Account model
        ref: 'Account', 
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

// Helper function that format the data
DomoSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    age: doc.age,
});

const DomoModel = mongoose.model('Domo', DomoSchema);
module.exports = DomoModel;