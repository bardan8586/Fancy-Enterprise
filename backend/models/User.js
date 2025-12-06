const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    }, 

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },

    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password required only if not a Google user
        },
        minLength: 6,
    },
    
    googleId: {
        type: String,
        sparse: true, // Allows multiple null values but enforces uniqueness when present
        unique: true,
    },
    
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },
    
    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
    resetToken: {
        type: String,
    },
    resetTokenExpiry: {
        type: Date,
    },
}, {timestamps: true}
)

// Hash the password (only for local users)

userSchema.pre("save", async function(next) {
    // Skip password hashing if password is not modified or user is Google user
    if(!this.isModified("password") || this.provider === "google") return next();
    if (!this.password) return next(); // Skip if no password (Google user)
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//match user entered password to Hashed password 

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model("User", userSchema); //this will export the model