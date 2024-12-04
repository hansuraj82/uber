const captainModel = require('../models/captain.model');


const createCaptain = async({firstName,lastName,email,password,type,capacity,plate,color}) => {
    if(!firstName || !lastName || !email || !password || !type || !capacity || !plate || !color) {
        throw new Error('All fields are mandatory');
    }

    const captain = await captainModel.create({
        fullName: {
            firstName,
            lastName
        },
        email,
        password,
        vehicle: {
            type,
            capacity,
            plate,
            color
        }
        
    })
    return captain;
    
}

module.exports = createCaptain;