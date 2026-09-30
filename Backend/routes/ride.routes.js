const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware')
const {body} = require('express-validator')
const rideController = require('../controllers/ride.controller')

router.post('/create-ride',
    body('origin').isString().isLength({min: 3}),
    body('destination').isString().isLength({min: 3}),
    body('vehicleType').isString().isLength({min: 3}),
    body('fare').isFloat({min: 0}),
    authMiddleware.authUser,
    rideController.createRide
)