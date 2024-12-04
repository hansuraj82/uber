const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const captainSchema = new mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true,
            minlength: [3, 'first name should be greater than three characters'],
        },
        lastName: {
            type: String,
            minlength: [3,'last name should be greater than three characters']
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    socketId: {
        type: String
    },
    status: {
        type: String,
        enum: ['active','inactive'],
        default: 'inactive',
    },
    vehicle: 
    {
        type: {
            type: String,
            enum: ['motorCycle','car','auto'],
            require: true,
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, "capacity must be at least one"]
        },
        plate: {
            type: String,
            required: true,
            unique: true,
            min: [3, "plate must be at least three characters long"]
        },
        color: {
            type: String,
            required: true,
            min: [3,"vehicle color must be at least three characters long"]
        }
    },
    location: {
        lat: {
            type: Number,
        },
        lng: {
            type: Number,
        }
    }
})

captainSchema.methods.comparePassword = async function (password) {
    try {
        return isMatched = await bcrypt.compare(password,this.password);
    } catch (error) {
        throw error;
    }
}

captainSchema.statics.hashPassword = async function (password) {
    try {
        const hashedPassword = await bcrypt.hash(password,10)
        return hashedPassword;
    } catch (error) {
        throw error;
    }
}

captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET,{expiresIn: '24h'});
    return token;
}


const Captain = mongoose.model('Captain',captainSchema);

module.exports = Captain;