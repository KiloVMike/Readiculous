const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const user = new mongoose.Schema({
    username: {
        type: String,
        required: function() { return !this.googleId; },
        unique: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [50, 'Username cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    password: {
        type: String,
        minlength: [6, 'Password must be at least 6 characters long']
    },
    address: {
        type: String,
        required: true,
        maxlength: [255, 'Address cannot exceed 255 characters']
    },
    avatar: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    fav: [
        {
            type: mongoose.Types.ObjectId,
            ref: "books"
        }
    ],
    cart: [
        {
            type: mongoose.Types.ObjectId,
            ref: "books"
        }
    ],
    order: [
        {
            type: mongoose.Types.ObjectId,
            ref: "order"
        }
    ],

    resetToken: {
        type: String,
        default: ""
    },
    resetTokenExpiry: {
        type: Date
    },

    googleId: [{ type: String, unique: true }], // Google ID for Google users
    invoices: [
        {
            fileName: String,
            pdf: String, // base64 string
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

// Hash password before saving (if password is modified)
user.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("user", user);
