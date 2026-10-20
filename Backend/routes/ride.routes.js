const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware')
const {body, query} = require('express-validator')
const rideController = require('../controllers/ride.controller')

router.post('/create-ride',
    body('pickup').isString().isLength({min: 3}),
    body('destination').isString().isLength({min: 3}),
    body('vehicleType').isString().isLength({min: 3}),
    authMiddleware.authUser,
    rideController.createRide
)

router.get('/get-fare',
    query('pickup').isString().isLength({min: 3}),
    query('destination').isString().isLength({min: 3}),
    authMiddleware.authUser,
    rideController.getFare
)

router.post('/confirm-ride', 
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    body('captainId').isMongoId().withMessage('Invalid captain id'),
    rideController.confirmRide
)

router.post('/start-ride', 
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    body('otp').isLength({min: 4, max: 4}).withMessage('Invalid otp'),
    body('captainId').isMongoId().withMessage('Invalid captain id'),
    rideController.startRide
)

router.post('/finish-ride', 
    authMiddleware.authCaptain, 
    body('rideId').isMongoId().withMessage('Invalid Ride id'),
    rideController.finishRide
)

module.exports = router;