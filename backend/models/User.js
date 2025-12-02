const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
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
      required: true,
      minLength: 6,
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    // Wishlist: list of product references the user has saved
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // Password reset fields
    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

//has the password 

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//match user entered password to Hashed password 

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash the token before storing (security best practice)
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Set expiry to 15 minutes from now
    this.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    
    return resetToken; // Return unhashed token for email
}

// Clear password reset token
userSchema.methods.clearPasswordResetToken = function() {
    this.resetPasswordToken = undefined;
    this.resetPasswordExpires = undefined;
}

module.exports = mongoose.model("User", userSchema); //this will export the model