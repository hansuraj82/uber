const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const captainController = require('../controller/captain.controller');
const { authCaptain } = require('../Middleware/auth.Middleware');


router.post('/register',[
    body('email').isEmail().withMessage('invalid Email'),
    body('fullName.firstName').isLength({min: 3}).withMessage('first name must be at least three characters long'),
    body('password').isLength({min: 3}).withMessage('password must be greater than three characters'),
    body('vehicle.type').isIn(['motorCycle','car','auto']).withMessage('vehicles other than motorcycle, car and auto are not allowed'),
    body('vehicle.capacity').isInt({min: 1}).withMessage('vehicle capacity must be at least one'),
    body('vehicle.plate').isLength({min: 6}).withMessage('vehicle number plate must be greater than 6 characters'),
    body('vehicle.color').isLength({min: 3}).withMessage('vehicle color must be at least three characters long')
],
captainController.registerCaptain
)

router.post('/login',[
    body('email').isEmail().withMessage('invalid Email'),
    body('password').isLength({min: 3}).withMessage('password must be greater than three characters'),
]
,captainController.captainLogin
)

router.get('/profile',authCaptain,captainController.captainProfile);
router.get('/logout',captainController.captainLogOut)

module.exports = router;

