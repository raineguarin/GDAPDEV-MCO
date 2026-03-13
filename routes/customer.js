// routes/customer.js

const express = require('express');
const router = express.Router();
const user = require('../model/user');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// This allows the user to upload an img from their local machine
const uploadDir = path.join(__dirname, '../assets/images/pfps');

// This makes the directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Picture Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/register', (req, res) => {
    res.render('register');
});


// Register
router.post('/register', upload.single('profilePic'), async (req, res) => {
    try {
        const { name, email, number, password, username } = req.body;
        
        const newUser = new user({
            name,
            email,
            phone: number,
            password, 
            username: username || email,
            role: 'Customer',
            profilePicture: req.file ? req.file.filename : 'default.jpg' 
        });

        await newUser.save();
        
        // 2. Change this from res.redirect to res.status(200).json
        res.status(200).json({ message: "Account created successfully" });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error during registration" });
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
                req.session.userId = userFound._id;
                
                if (userFound.role === 'Admin') {
                    res.redirect('/admin-homepage'); 
                } else {
                    res.redirect('/profile'); 
                }
                
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
router.get('/profile', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.redirect('/login'); 
        }

        const userFound = await user.findById(req.session.userId);

        if (userFound) {
            res.render('profile', { user: userFound }); 
        } else {
            res.status(404).send("User not found.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Sorry, an error occurred while loading the profile.");
    }
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

//logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error logging out:", err);
            return res.status(500).send("Could not log out.");
        }
        
        res.clearCookie('connect.sid'); 
        
        res.redirect('/'); 
    });
});

module.exports = router;