const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        username: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        penName: {
            type: String
        },
        isAuthor: {
            type: Boolean,
            default: false
        },

    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;