const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Review = require('../model/review');
const vehicle = require('../model/vehicle');
const reservation = require('../model/reservation');

// GET: Show the Manage Vehicles admin page
router.get('/manage-vehicles', async (req, res) => {
    try {
        const allVehicles = await vehicle.find({});
        res.render('manage-vehicles', { vehicles: allVehicles });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading vehicles.");
    }
});

router.post('/delete-vehicle', async (req, res) => {
    try {
        const { id } = req.body;
        await vehicle.findByIdAndDelete(id);
        res.status(200).json({ message: "Vehicle deleted" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ error: "Database error while deleting vehicle." });
    }
});

// GET: Show the public Cars page
router.get('/cars', async (req, res) => {
    try {
        const allVehicles = await vehicle.find({ status: true }).lean();

        for (let car of allVehicles) {
            car.reviews = await Review.find({ car: car._id }).populate('user', 'name');
            car.likeCount = (car.likes || 0) + (car.likedBy?.length || 0);
        }

        allVehicles.sort((a, b) => b.likeCount - a.likeCount);

        res.render('cars', { vehicles: allVehicles });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading vehicles.");
    }
});

router.post('/like-vehicle', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "Log in to like!" });
    }

    try {
        const { carId } = req.body;
        const car = await vehicle.findById(carId);

        if (!car.likedBy) car.likedBy = [];

        const userId = req.session.userId;
        const index = car.likedBy.indexOf(userId);

        if (index === -1) {
            car.likedBy.push(userId);
        } else {
            car.likedBy.splice(index, 1);
        }

        await car.save();

        const likeCount = (car.likes || 0) + car.likedBy.length;

        res.json({ likeCount });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update likes" });
    }
});


router.get('/search', (req, res) => {
    res.render('search');
});

router.post('/search', async (req, res) => {
    try {
        const { searchDate, capacity } = req.body;

        const conflictingReservations = await reservation.find({
            date: searchDate
        });

        const unavailableIds = conflictingReservations.map(r => r.vehicle);

        let query = {
            _id: { $nin: unavailableIds }
        };

        if (capacity) {
            query.capacity = Number(capacity);
        }

        const filteredVehicles = await vehicle.find(query).lean();

        for (let car of filteredVehicles) {
            car.reviews = await Review.find({ car: car._id }).populate('user', 'name');
            car.likeCount = (car.likes || 0) + (car.likedBy?.length || 0);
        }

        filteredVehicles.sort((a, b) => b.likeCount - a.likeCount);

        res.render('cars', {
            vehicles: filteredVehicles
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Search failed.");
    }
});

const storage = multer.diskStorage({
    destination: './assets/images/',
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/save-vehicle', upload.single('vehicleImage'), async (req, res) => {
    try {
        const { id, brand, model, carType, capacity, dailyRate, status, existingImage } = req.body;
        
        const imagePath = req.file ? `/images/${req.file.filename}` : existingImage;

        if (id && id.trim() !== "") {
            await vehicle.findByIdAndUpdate(id, {
                brand, model, carType, capacity, dailyRate,
                status: status === 'true',
                image: imagePath
            });
        } else {
            const newVehicle = new vehicle({
                brand, model, carType, capacity, dailyRate,
                status: status === 'true',
                image: imagePath || '/images/default.png'
            });
            await newVehicle.save();
        }
        res.status(200).send("Success");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;