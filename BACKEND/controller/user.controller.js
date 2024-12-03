const BlacklistedToken = require('../models/blacklistedToken.model');
const userModel = require('../models/user.model');
const userService = require('../services/user.services');
const {validationResult} = require('express-validator');

//method to register an user
const registerUser = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    const {fullName, email, password} = req.body;

    const hashedPassword = await userModel.hashPassword(password);


    const user = await userService.createUser({
        firstName: fullName.firstName,
        lastName: fullName.lastName, 
        email, 
        password: hashedPassword
    });

    res.status(201).json({token,user});
}


//method for login by email and password;
const loginUser = async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const {email,password} = req.body;
        const user = await userModel.findOne({email}).select('+password');

        if(!user) {
            return res.status(401).json({msg: "invalid email or password"});
        }
        const isMatch =  await user.comparePassword(password);
        
        if(!isMatch) {
            return res.status(401).json({msg: "invalid email or password"});
        }

        const token = user.generateAuthToken();
        
        res.cookie('token',token);

        return res.status(200).json({token,user});

    } catch (error) {
       return res.status(500).json({error: "something went wrong"}); 
    }
}


const getUserProfile = (req,res,next) => {
    return res.status(200).json(req.user);
}


const logoutProfile = async(req,res) => {
    res.clearCookie('token');
    console.log('req.cookie', req.cookies.token)
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token) {
        return res.status(401).json({msg: "unauthorized user"})
    }
    console.log('token in logout is after clearence ',token);

    const blacklistedToken = await BlacklistedToken.findOne({token: token});
    if(blacklistedToken) {
        return res.status(401).json({msg: 'Token expired'})
    }

    await BlacklistedToken.create({token});

    res.status(200).json({msg: 'user Logged out successfully'});
}






module.exports = {registerUser,loginUser,getUserProfile,logoutProfile};