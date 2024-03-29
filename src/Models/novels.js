const mongoose = require("mongoose");
const { Chapter } = require("./novels.js");

const chapterSchema = new mongoose.Schema({
    seqId: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });


chapterSchema.pre('save', async function (next) {
    try {
        if (!this.seqId) {
            const count = await Chapter.countDocuments();
            this.seqId = count + 1;
        } else {
            this.seqId = 1;
        }
        next();
    } catch (error) {
        next(error);
    }
});


const novelSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        ref: 'User',
        required: true,
    },
    genre: {
        type: String,
        required: true,
        enum: ['Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'Thriller', 'Horror', 'Historical Fiction', 'Non-Fiction', 'Other']

    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    published: {
        type: Boolean,
        default: false
    },
    publicationDate: {
        type: Date
    },
    chapters: [chapterSchema] // Array of chapters
}, { timestamps: true });

// Create a model for the novel
const Novel = mongoose.model('Novel', novelSchema, 'Novels');

module.exports = Novel;