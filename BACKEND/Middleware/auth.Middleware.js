const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const BlacklistedToken = require('../models/blacklistedToken.model');
const captainModel = require('../models/captain.model');

const authUser = async (req,res,next) => {
    const token =   req.cookies ?. token || req.headers.authorization ?.split(' ')[1];
    if(!token) {
        return res.status(401).json({msg: "unauthorized user"});
    }
    const isBlackListedToken = await BlacklistedToken.findOne({token: token});
    if(isBlackListedToken) {
        
        return res.status(401).json({msg: "Token Expired"})
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({msg: "anauthorized user"});
    }
}


const authCaptain = async (req,res,next) => {
    try {
        const token = req.cookies ?.token || req.headers.authorization ?.split(' ')[1];
        if(!token) {
            return res.status(401).json({msg: 'unauthorized captain'})
        }
        const isBlackListedToken = await BlacklistedToken.findOne({token});
        if(isBlackListedToken) {
            return res.status(401).json({msg: 'Token Expired'});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id);
        req.captain = captain;
        return next();
    
    }catch(error) {
        return res.status(500).json({msg: 'Error while authentication'})
    }
    
}



module.exports = {authUser,authCaptain};