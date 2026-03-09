const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    brand: String,
    model: String,    
    carType: String,
    capacity: Number,
    dailyRate: Number, 
    likes: Number
});

module.exports = mongoose.model('Vehicle', vehicleSchema);