const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    phone: { type: String },

    friends: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],

    friendRequests: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    
    // Admin
    staffID: { type: String }, 
});

//actual hashing
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    // prevent double hashing
    if (this.password.startsWith('$2')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//Password compare
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
