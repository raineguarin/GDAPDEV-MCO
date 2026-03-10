const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    username: { type: String, required: true, unique: true },
    status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    role: { type: String, enum: ['Customer', 'Admin'], required: true }, 
    
    // Customer
    licenseNumber: { type: String }, 
    isVerified: { type: Boolean, default: false }, 
    profilePicture: { type: String, default: 'default.jpg' }, 
    description: { type: String },
    isPublic: { type: Boolean, default: true }, 
    
    // Admin
    staffID: { type: String } 
});

module.exports = mongoose.model('User', userSchema);