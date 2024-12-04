const captainModel = require('../models/captain.model');
const { validationResult } = require('express-validator');
const createCaptain = require('../services/captain.services');
const BlacklistedToken = require('../models/blacklistedToken.model');




const registerCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array() });
    }

    try {
        const { fullName, email, password, vehicle } = req.body;

        const hashedPassword = await captainModel.hashPassword(password);
        //in findOne method $or will find either email exists or not or vehicle exists or not
        const existData = await captainModel.findOne({ $or: [{ email }, { 'vehicle.plate': vehicle.plate }] });
        if (existData) {
            if (existData.email == email) {
                return res.status(400).json({ msg: 'email already exists' });
            }
            if (existData.vehicle.plate == vehicle.plate) {
                return res.status(400).json({ msg: 'vehicle already exists' });
            }
        }

        const captain = await createCaptain({
            firstName: fullName.firstName,
            lastName: fullName.lastName,
            email,
            password: hashedPassword,
            type: vehicle.type,
            capacity: vehicle.capacity,
            plate: vehicle.plate,
            color: vehicle.color
        })
        return res.status(201).json({ captain })
    } catch (error) {
        return res.status(500).json({ msg: 'error while registration' })
    }

}



const captainLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const captain = await captainModel.findOne({ email }).select('+password');
        if (!captain) {
            return res.status(400).json({ msg: 'invalid email or password' });
        }
        const isMatch = await captain.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'invalid email or password' });
        }
        const token = await captain.generateAuthToken();
        res.cookie('token', token);
        return res.status(200).json({ captain, token });

    } catch (error) {
        res.status(500).json({ msg: "server error" });
    }

}



const captainProfile = (req, res) => {
    const captain = req.captain;
    return res.status(200).json({ captain });
}

const captainLogOut = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        res.clearCookie('token');
        if (token) {
            await BlacklistedToken.create({ token });
            return res.status(200).json({ msg: 'captain logged out successfully' })
        }
        return res.status(404).json({msg: 'Token Not Found'})

    } catch (error) {
        return res.status(500).json({ msg: 'error while logout the captain ' })
    }
}


module.exports = { registerCaptain, captainLogin, captainProfile, captainLogOut };