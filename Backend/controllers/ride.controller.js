const rideService = require('../services/ride.service');
const mapService = require('../services/maps.service')
const { validationResult } = require('express-validator');
const { sendMessageToSocketId } = require('../socket');
const userModel = require('../models/user.model');
const rideModel = require('../models/ride.model');


module.exports.createRide = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
        res.status(201).json(ride);

        const pickupCoordinates = await mapService.getAddressCoordinates(pickup);

        const captainsInRadius = await mapService.getCaptainInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 5)

        ride.otp = "";

        const rideWithUser = await rideModel.findOne({_id: ride._id}).populate('user');

        captainsInRadius.map(captain => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            })
        })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports.getFare = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);

        return res.status(200).json(fare);
    } catch (error) {
        console.error("Error calculating fare:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}  

module.exports.confirmRide = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { rideId, captainId } = req.body;

    try {
        const ride = await rideService.confirmRide(rideId, captainId)

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

module.exports.startRide = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {rideId, otp, captainId} = req.body

    try {
        const ride = await rideService.startRide(rideId, otp, captainId);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })
        return res.status(200).json(ride)
    } catch(err) {
        return res.status(500).json({message: err.message})
    }
}

module.exports.finishRide = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.finishRide(rideId);

        console.log(ride.user.socketId)

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })

        return res.status(200).json(ride)
    } catch {
        return res.status(400).json({ errors: errors.array() })
    }
}