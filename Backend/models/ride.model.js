const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    origin: {
        type: String,
        required: true 
    },
    destination: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        required: true
    },
    fare: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'on_way', 'completed', 'cancelled'],
        default: 'pending'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver'
    },
    distance: {
        type: Number,
        required: true,
        min: 0
    },
    duration: {
        type: Number,
        required: true,
        min: 0
    },

    
})