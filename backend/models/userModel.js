import mongoose from "mongoose";

// Define userSchema
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true, // Fix typo: 'require' to 'required'
    },
    email: {
        type: String,
        required: true, // Fix typo
        unique: true,   // Ensure no duplicate emails
        lowercase: true, // Ensure email is stored in lowercase
        trim: true,      // Remove whitespace around the email
    },
    password: {
        type: String,
        required: true, // Ensure password is provided
        minlength: 6,   // Enforce a minimum password length
    },
    isAdmin: {
        type: Boolean,
        default: false, // By default, users are not admins
    },
    streak:{
        startDate: { type: String, required: true },
        lastUpdated: { type: String, required: true },
        history: { type: [String], default: [] },
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set to the current date
    },

});

// Export the model
const User = mongoose.model("user", userSchema);
export default User;
