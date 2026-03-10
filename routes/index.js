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

module.exports = router;