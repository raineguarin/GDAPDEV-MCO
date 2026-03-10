// routes/reservations.js
const express = require('express');
const router = express.Router();

const reservation = require('../model/reservation');

// GET: Show the Manage Reservations admin page
router.get('/manage-reservations', async (req, res) => {
    try {
        const allReservations = await reservation.find({});
        // Renders the view/manage-reservations.hbs file
        res.render('manage-reservations', { reservations: allReservations });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading reservations.");
    }
});

// POST: Update a reservation status (e.g., Approve or Cancel)
router.post('/update-reservation', async (req, res) => {
    // put the MongoDB update logic here later
    res.send("Reservation updated! (Logic coming soon)");
});

module.exports = router;