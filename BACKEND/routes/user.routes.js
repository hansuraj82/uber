const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const userController = require('../controller/user.controller');
const authUser = require('../Middleware/auth.Middleware');


//post method to register the user
router.post('/register', 
    [body('email').isEmail().withMessage('Invalid Email'),
    body('fullName.firstName').isLength({min: 3}).withMessage('first name must be greater than 3 characters'),
    body('password').isLength({min: 6}).withMessage('password must be greater than 6 characters'),
    ],
    userController.registerUser
);

router.post('/login', 
[body('email').isEmail().withMessage('Invalid Email'),
body('password').isLength({min: 6}).withMessage('password must be greater than 6 characters')
],
userController.loginUser)


router.get('/profile',authUser,userController.getUserProfile)

router.get('/logout',userController.logoutProfile)


module.exports = router;