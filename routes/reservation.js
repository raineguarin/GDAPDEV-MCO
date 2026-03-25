// routes/reservations.js
const express = require('express');
const router = express.Router();
const user = require('../model/user'); 
const reservation = require('../model/reservation');
const review = require('../model/review');
const vehicle = require('../model/vehicle');

// GET: Show the Manage Reservations admin page
router.get('/manage-reservations', async (req, res) => {
    try {
        const allReservations = await reservation.find({})
            .populate('customer')
            .populate('vehicle');

        const allVehicles = await vehicle.find({});

        res.render('manage-reservations', { 
            reservations: allReservations,
            vehicles: allVehicles 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading reservations.");
    }
});

router.post('/update-reservation-status', async (req, res) => {
    try {
        const { id, status } = req.body;

        const updatedRes = await reservation.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );

        if (!updatedRes) {
            return res.status(404).json({ error: "Reservation not found." });
        }

        res.status(200).json({ message: "Status updated successfully." });
    } catch (err) {
        console.error("Status Update Error:", err);
        res.status(500).json({ error: "Server error updating status." });
    }
});

// POST: Create a new reservation (Customer side)
router.post('/reservation', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: "Please log in first." });
        }

        const { carId, date, time } = req.body;

        const existingReservation = await reservation.findOne({
            vehicle: carId,
            date: date,
            status: { $in: ['Pending', 'Approved'] } 
        });

        if (existingReservation) {
            return res.status(400).json({ error: "Sorry, this car is already reserved for this date!" });
        }

        const newRes = new reservation({
            customer: req.session.userId,
            vehicle: carId,
            date,
            time
        });

        await newRes.save();
        res.status(201).json({ message: "Success" });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save reservation." });
    }
});

// GET: Show a user's own reservations
router.get('/reservations', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.redirect('/login');
        }

        const allMyBookings = await reservation.find({ customer: req.session.userId })
                                                .populate('vehicle');

        const processing = allMyBookings.filter(b => b.status === 'Pending');
        const ongoing = allMyBookings.filter(b => b.status === 'Approved');
        const completed = allMyBookings.filter(b => b.status === 'Completed');

        res.render('reservations', { 
            processing, 
            ongoing, 
            completed 
        });
    } catch (err) {
        console.error("Error fetching reservations:", err);
        res.status(500).send("Error loading your reservations.");
    }
});

// GET: Review page
router.get('/review/:vehicleId', async (req, res) => {
    try {
        const vehicle = await vehicle.findById(req.params.vehicleId);

        res.render('review', {
            vehicle
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading review page.");
    }
});

// POST: Submit a review
router.post('/submit-review', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Login required." });
    }

    try {
        const { vehicleId, reservationId, title, description } = req.body;

        const existingReview = await review.findOne({
            user: req.session.userId,
            car: vehicleId
        });

        if (existingReview) {
            return res.status(400).json({ error: "You already reviewed this vehicle." });
        }

        const newReview = new review({
            user: req.session.userId,
            car: vehicleId,
            title,
            description
        });

        await newReview.save();
        res.json({ message: "Review saved!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to submit review." });
    }
});

// POST: Customer cancels their own reservation
router.post('/cancel', async (req, res) => {
    try {
        const { reservationId } = req.body;

        if (!req.session.userId) {
            return res.status(401).json({ error: "Please log in first." });
        }

        const result = await reservation.findOneAndUpdate(
            { _id: reservationId, customer: req.session.userId },
            { status: 'Cancelled' },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ error: "Reservation not found or unauthorized." });
        }

        res.status(200).json({ message: "Successfully cancelled." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during cancellation." });
    }
});


// POST: Admin creates a Walk-in Reservation
router.post('/admin-add-reservation', async (req, res) => {
    try {
        const { customerEmail, vehicleId, date, time } = req.body;
        
        const foundCustomer = await user.findOne({ email: customerEmail });
        
        if (!foundCustomer) {
            return res.status(404).json({ error: "No customer found with that email." });
        }

        const newWalkin = new reservation({
            customer: foundCustomer._id,
            vehicle: vehicleId, 
            date: date,
            time: time,
            status: 'Approved', // Walk-ins are usually instantly approved
            paymentStatus: 'Unpaid'
        });

        await newWalkin.save();
        res.status(200).json({ message: "Walk-in created successfully." });

    } catch (err) {
        console.error("Walk-in Error:", err);
        res.status(500).json({ error: "Server error while creating walk-in." });
    }
});

module.exports = router;