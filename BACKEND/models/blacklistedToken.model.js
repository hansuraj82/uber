const mongoose = require('mongoose');


const blacklistedTokenModel = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 86400 //24hrs in seconds
    }

})

const BlacklistedToken = mongoose.model('BlacklistedToken',blacklistedTokenModel);

module.exports = BlacklistedToken;