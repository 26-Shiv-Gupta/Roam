const express = require('express');
const router = express.Router();
const { body } = require('express-validator')
const captainController = require('../controllers/captain.Controller')
const authMiddleware = require('../middlewares/auth.middleware')

// Captain Register Route
router.post('/register', [
    body('email').isEmail().withMessage('Invaild Email'),
    body('fullname.firstname').isLength(3).withMessage('First name must be 3 characters long'),
    body('password').isLength(6).withMessage('Password must be at least 6 characters long'),
    body('vechile.color').isLength(3).withMessage('Color must be 3 characters long'),
    body('vechile.plate').isLength(3).withMessage('Plate must be 3 characters long'),
    body('vechile.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vechile.vechileType').isLength(3).withMessage('Vechile type must be 3 characters long'),
], captainController.registerCaptain)

// Captain Login Route
router.post('/login', [
    body('email').isEmail().withMessage('Invaild Email'),
    body('password').isLength(6).withMessage('Password must be at least 6 character long')
], captainController.loginCaptain)

// Captain Profile Route
router.get('/profile', authMiddleware.authCaptain, captainController.getCaptainProfile);

// Captain Logout Route
router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain);

module.exports = router;