// routes/users.js
const express = require('express');
const router = express.Router();
const user = require('../model/user');

// 1. GET: Show the Manage Users page
router.get('/manage-users', async (req, res) => {
    const allUsers = await user.find({});
    res.render('manage-users', { users: allUsers });
});

// 2. POST: Add a new user (When admin submits the "Add Customer" form)
router.post('/add-user', async (req, res) => {
    // Logic to save a new user to the database goes here
});

// 3. POST: Suspend or Delete a user
router.post('/delete-user', async (req, res) => {
    // Logic to delete or update status in the database goes here
});

module.exports = router;