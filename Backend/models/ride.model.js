const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver'
    },
    pickup: {
        type: String,
        required: true 
    },
    destination: {
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
    paymentId: {
        type: String
    },
    orderId: {
        type: String
    },
    otp: {
        type: String,
        select: false,
        required: true
    }
})

module.exports = mongoose.model('ride', rideSchema);