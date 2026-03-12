// routes/users.js
const express = require('express');
const router = express.Router();
const user = require('../model/user');

// 1. GET: Show the Manage Users page
router.get('/manage-users', async (req, res) => {
    try {
        const allUsers = await user.find({});
        res.render('manage-users', { users: allUsers });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading users.");
    }
});

// 2. POST: Add or Edit a User
router.post('/save-user', async (req, res) => {
    try {
        const { id, name, username, email, role, status, licenseNumber, isVerified } = req.body;

        if (id && id.trim() !== "") {
            console.log(`Updating user: ${id}`);
            
            const updatedData = {
                name,
                username,
                email,
                role,
                status,
                licenseNumber,
                isVerified: isVerified === true || isVerified === 'true' 
            };

            const result = await user.findByIdAndUpdate(id, updatedData, { new: true });
            
            if (!result) {
                return res.status(404).json({ error: "User not found in database." });
            }
            
            return res.status(200).json({ message: "User updated successfully!" });
        } 

        console.log("Adding new user...");
        const newUser = new user({
            name,
            username,
            email,
            role,
            status,
            licenseNumber,
            isVerified,
            password: "password123" 
        });

        await newUser.save();
        res.status(200).json({ message: "User created successfully!" });

    } catch (err) {
        console.error("Save Error:", err);
        if (err.code === 11000) {
            return res.status(400).json({ error: "Username or Email already exists." });
        }
        res.status(500).json({ error: err.message });
    }
});

// 3. POST: Delete a User
router.post('/delete-user', async (req, res) => {
    try {
        const { id } = req.body;
        await user.findByIdAndDelete(id);
        
        res.status(200).json({ message: "User deleted successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete user." });
    }
});

module.exports = router;