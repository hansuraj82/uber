const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fullName: {
        firstName: {
            type: String,
            required: true,
            minlength: [3, 'first name must be at least 3 characters']
        },
        lastName: {
            type: String,
            minlength: [3, 'first name must be at least 3 characters']
        },
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    socketId: {
        type: String,
    }
}, { timestamps: true });

//method for generate jwt tokens
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
    return token;
}

//method for compare the user password
userSchema.methods.comparePassword = async function (password) {
    try {
        const isMatch = await bcrypt.compare(password, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }

}


//method for hashing(protect) the password while registering the user
userSchema.statics.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}


const User = mongoose.model('User', userSchema)

module.exports = User;

