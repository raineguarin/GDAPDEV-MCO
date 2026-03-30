// routes/index.js

const express = require('express');
const router = express.Router();

const vehicle = require('../model/vehicle'); 
const user = require('../model/user');
const reservation = require('../model/reservation');
const Review = require('../model/review');

// Homepage Route
router.get('/', async (req, res) => {
    try {
        // if user has existing cookie login, redirect to profile
        if(req.session.userId) {
            return res.redirect('/profile');
        }

        // .limit(3) keeps only the first 3 cars for the UI layout
        const featured = await vehicle.find().limit(3); 
        
        res.render('homepage', { 
            featuredCars: featured 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading homepage: " + err.message);
    }
});

// Admin Homepage
router.get('/admin-homepage', async (req, res) => {
    try {
        const userCount = await user.countDocuments();
        const vehicleCount = await vehicle.countDocuments({ status: true });
        const reservationCount = await reservation.countDocuments();

        res.render('admin-homepage', {
            totalUsers: userCount,
            activeReservations: reservationCount,
            availableVehicles: vehicleCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading admin dashboard.");
    }
});

// Admin Profile
router.get('/admin-profile', async (req, res) => {
    try {
        //check if they have a session ID
        if (!req.session.userId) {
            return res.redirect('/login'); 
        }

        const currentUser = await user.findById(req.session.userId);

        if (!currentUser) {
            return res.redirect('/login');
        }

        res.render('admin-profile', { user: currentUser });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading profile page.");
    }
});

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

// Contact-us page
router.get('/contact-us', (req, res) => {
    res.render('contact-us');
});

// About page
router.get('/about', (req, res) => {
    res.render('about');
});

// Friends page
router.get('/friends', async (req, res) => {
    try {
        const userId = req.session.userId;

        
        const currentUser = await user.findById(req.session.userId);

        if (!currentUser) {
            return res.redirect('/login');
        }

        const friends = currentUser.friends || [];

        
        const friendReviews = await Review.find({
            user: { $in: friends }
        }) 
        .populate('user', 'name')
        .populate('car', 'brand model');

        const otherReviews = await Review.find({
            user: { $nin: [...friends, userId] }
        })
        .populate('user', 'name')
        .populate('car', 'brand model');

        res.render('friends', {
            friendReviews,
            otherReviews
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to load friends reviews");
    }
});

router.post('/addFriend', async (req, res) => {
    try {

        const currentUser = req.session.userId;
        const friendId = req.body.friendId;

        if (!currentUser) {
            return res.redirect('/login');
        }

        await user.findByIdAndUpdate(
            currentUser,
            { $addToSet: { friends: friendId } }
        );

        await user.findByIdAndUpdate(
            friendId,
            { $addToSet: { friends: currentUser } }
        );

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.json({ success: false });
    }
});

module.exports = router;