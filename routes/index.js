// routes/index.js

const express = require('express');
const router = express.Router();

const vehicle = require('../model/vehicle'); 
const user = require('../model/user');
const reservation = require('../model/reservation');

// Homepage Route
router.get('/', async (req, res) => {
    try {
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
        const vehicleCount = await vehicle.countDocuments({ status: 'Available' }); 
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
module.exports = router;