// routes/vehicles.js
const express = require('express');
const router = express.Router();

const vehicle = require('../model/vehicle');

// GET: Show the Manage Vehicles admin page
router.get('/manage-vehicles', async (req, res) => {
    try {
        const allVehicles = await vehicle.find({});
        // Renders the view/manage-vehicles.hbs file
        res.render('manage-vehicles', { vehicles: allVehicles });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading vehicles.");
    }
});

// POST: Add a new vehicle to the database
router.post('/add-vehicle', async (req, res) => {
    // put the MongoDB save logic here later
    res.send("Vehicle added! (Logic coming soon)");
});

module.exports = router;