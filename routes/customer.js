// routes/customer.js

const express = require('express');
const router = express.Router();
const user = require('../model/user');
const review = require('../model/review');
const bcrypt = require('bcrypt');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// const uploadDir = path.join(__dirname, '../assets/images/pfps');
const os = require('os');
const path = require('path');

const uploadDir = path.join(os.tmpdir(), 'pfps');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

//pictures
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });
router.get('/register', (req, res) => {
    res.render('register');
});

//registration
router.post('/register', upload.single('profilePic'), async (req, res) => {
    try {
        let { name, email, number, password, username } = req.body;

        email = email.trim();
        password = password.trim();

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

        res.status(200).json({ message: "Account created successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error during registration" });
    }
});

//login get
router.get('/login', (req, res) => {
    res.render('login');
});

//login post
router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body;

        email = email.trim();
        password = password.trim();

        const userFound = await user.findOne({ email });

        if (!userFound) {
            return res.status(404).send("No users found.");
        }

        let isMatch = false;


        if (userFound.password.startsWith('$2')) {
            isMatch = await bcrypt.compare(password, userFound.password);
        } 

        else {
            console.log("Migrating plain-text password...");

            if (userFound.password.trim() !== password) {
                return res.status(401).send("Invalid Password");
            }

            const hashed = await bcrypt.hash(password, 10);

            userFound.password = hashed;
            await userFound.save();
            isMatch = true;
        }

        if (!isMatch) {
            return res.status(401).send("Invalid Password");
        }

        req.session.userId = userFound._id;

        if (userFound.role === 'Admin') {
            return res.redirect('/admin-homepage');
        } else {
            return res.redirect('/profile');
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Login error.");
    }
});


router.get('/profile', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.redirect('/login');
        }

        const currentUser = await user.findById(req.session.userId);
        const userReviews = await review.find({ user: req.session.userId }).populate('car');

        res.render('profile', {
            reviews: userReviews,
            user: currentUser
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading profile.");
    }
});


router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).send("Could not log out.");
        }

        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

module.exports = router;