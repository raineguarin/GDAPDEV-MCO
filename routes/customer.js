// routes/customer.js

const express = require('express');
const router = express.Router();
const User = require('../model/user');

router.get('/register', (req, res) => {
    res.render('register');
});

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, number, password, username } = req.body;

        const newUser = new User({
            name,
            email,
            phone: number,
            password, 
            username: username || email,  // uses email as a fallback 
            role: 'Customer'
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration failed. Email might already exist." });
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

// Login
router.post('/login', async (req, res) => {
    try{
        const {email, password} = req.body;
        const userFound = await user.findOne({ email: email });
        
        if(userFound){
            if(userFound.password == password){
                res.redirect('/profile');
            } else {
                res.status(401).send("Invalid Password");
            }
        } else {
            res.status(404).send("No users found.");
        }
    } catch (err){
        console.error(err);
        res.status(500).send("Sorry, an error occured in login.");  
    }
});

// Profile
router.get('/profile', (req, res) => {
    res.render('profile');
});

router.post('/profile', async (req, res) => {
    try {
        const userEmail = req.query.email;
        const userFound = await user.find({email: userEmail});

        if(userFound){
            res.render('/profile', {name: userFound.name});
        } else {
            res.status(404).send("No users found.");
        }
    } catch(err){
        console.error(err);
        res.status(500).send("Sorry, an error occured.");
    }
});

module.exports = router;