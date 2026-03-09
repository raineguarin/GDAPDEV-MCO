// routes/index.js

const express = require('express');
const router = express.Router();

const vehicle = require('../model/vehicle'); 

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

module.exports = router;