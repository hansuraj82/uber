const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const BlacklistedToken = require('../models/blacklistedToken.model');

const authUser = async (req,res,next) => {
    const token =   req.cookies ?. token || req.headers.authorization ?.split(' ')[1];
    const isBlackListedToken = await BlacklistedToken.findOne({token: token});
    if(isBlackListedToken) {
        
        return res.status(401).json({msg: "Token Expired"})
    }
    if(!token) {
        return res.status(401).json({msg: "unauthorized user"});
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



module.exports = authUser;