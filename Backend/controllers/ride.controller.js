module.exports.createRide = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

}

    
const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');


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